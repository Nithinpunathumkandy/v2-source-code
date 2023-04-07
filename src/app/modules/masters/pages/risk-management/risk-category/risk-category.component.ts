import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy, Renderer2 } from '@angular/core';
import { RiskCategory } from 'src/app/core/models/masters/risk-management/risk-category';
import{RiskCategoryMasterStore} from 'src/app/stores/masters/risk-management/risk-category-store';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RiskCategoryService } from 'src/app/core/services/masters/risk-management/risk-category/risk-category.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { ImportItemStore } from "src/app/stores/general/import-item.store";


declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-risk-category',
  templateUrl: './risk-category.component.html',
  styleUrls: ['./risk-category.component.scss']
})
export class RiskCategoryComponent implements OnInit, OnDestroy {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  RiskCategoryMasterStore = RiskCategoryMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_risk_category_message';

  riskCategoryObject = {
    component: 'Master',
    values: null,
    type: null
  };

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  riskCategorySubscriptionEvent: any = null;
  popupControlRiskCategoryEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(  private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _riskCategoryService: RiskCategoryService){}

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_risk_category'});

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'RISK_CATEGORY_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_RISK_CATEGORY', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_RISK_CATEGORY_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_RISK_CATEGORY', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_RISK_CATEGORY', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_RISK_CATEGORY', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path: 'risk-management'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_RISK_CATEGORY')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
         
    
          if (SubMenuItemStore.clikedSubMenuItem) {
    
            switch (SubMenuItemStore.clikedSubMenuItem.type) {
              case "new_modal":
                setTimeout(() => {
                this.addNewItem();
                }, 1000);
                break;
              case "template":
                this._riskCategoryService.generateTemplate();
                break;
              case "export_to_excel":
                this._riskCategoryService.exportToExcel();
                break;
              case "search":
                RiskCategoryMasterStore.searchText = SubMenuItemStore.searchText;
                this.pageChange(1);
                break;
              case "share":
                ShareItemStore.setTitle('share_risk_category_title');
                ShareItemStore.formErrors = {};
                break;
              case "import":
                ImportItemStore.setTitle('import_risk_category');
                ImportItemStore.setImportFlag(true);
                break;
              default:
                break;
            }
            // Don't forget to unset clicked item immediately after using it
            SubMenuItemStore.unSetClickedSubMenuItem();
          }
          if(NoDataItemStore.clikedNoDataItem){
            this.addNewItem();
            NoDataItemStore.unSetClickedNoDataItem();
          }
          if(ShareItemStore.shareData){
            this._riskCategoryService.shareData(ShareItemStore.shareData).subscribe(res=>{
                ShareItemStore.unsetShareData();
                ShareItemStore.setTitle('');
                ShareItemStore.unsetData();
                $('.modal-backdrop').remove();
                document.body.classList.remove('modal-open');
                setTimeout(() => {
                  $(this.mailConfirmationPopup.nativeElement).modal('show');              
                }, 200);
            },(error)=>{
              if(error.status == 422){
                ShareItemStore.processFormErrors(error.error.errors);
              }
              ShareItemStore.unsetShareData();
              this._utilityService.detectChanges(this._cdr);
              $('.modal-backdrop').remove();
              console.log(error);
            });
          }
          if(ImportItemStore.importClicked){
            ImportItemStore.importClicked = false;
            this._riskCategoryService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
              ImportItemStore.unsetFileDetails();
              ImportItemStore.setTitle('');
              ImportItemStore.setImportFlag(false);
              $('.modal-backdrop').remove();
              this._utilityService.detectChanges(this._cdr);
            },(error)=>{
              if(error.status == 422){
                ImportItemStore.processFormErrors(error.error.errors);
              }
              else if(error.status == 500 || error.status == 403){
                ImportItemStore.unsetFileDetails();
                ImportItemStore.setImportFlag(false);
                $('.modal-backdrop').remove();
              }
              this._utilityService.detectChanges(this._cdr);
            })
          }
        })

         // for deleting/activating/deactivating using delete modal
      this.popupControlRiskCategoryEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })

      this.riskCategorySubscriptionEvent = this._eventEmitterService.riskCategory.subscribe(res => {
        this.closeFormModal();
      })

      this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
        if(!status && $(this.formModal.nativeElement).hasClass('show')){
          this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
          this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
        }
      })
  
      this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
        if(!status && $(this.formModal.nativeElement).hasClass('show')){
          this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
          this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
        }
      })

    this.pageChange(1);
  }
  addNewItem(){
    this.riskCategoryObject.type = 'Add';
    this.riskCategoryObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) RiskCategoryMasterStore.setCurrentPage(newPage);
    this._riskCategoryService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.riskCategoryObject.type = null;
  }

  // for activate 
activate(id: number) {
  // event.stopPropagation();
  this.popupObject.type = 'Activate';
  this.popupObject.id = id;
  this.popupObject.title = 'Activate Risk Category?';
  this.popupObject.subtitle = 'common_activate_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for deactivate
deactivate(id: number) {
  // event.stopPropagation();
  this.popupObject.type = 'Deactivate';
  this.popupObject.id = id;
  this.popupObject.title = 'Deactivate Risk Category?';
  this.popupObject.subtitle = 'common_deactivate_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');
}

// modal control event
modalControl(status: boolean) {
  switch (this.popupObject.type) {
    case '': this.deleteRiskCategory(status)
    break;
    case 'Activate': this.activateRiskCategory(status)
      break;

    case 'Deactivate': this.deactivateRiskCategory(status)
      break;

  }

}
 // delete function call
 deleteRiskCategory(status: boolean) {
  if (status && this.popupObject.id) {
    this._riskCategoryService.delete(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    },(error=>{
      if(error.status == 405 && RiskCategoryMasterStore.getRiskCategoryById(this.popupObject.id).status_id == AppStore.activeStatusId){
        let id = this.popupObject.id;
        this.closeConfirmationPopUp();
        this.clearPopupObject();
        setTimeout(() => {
          this.deactivate(id);
          this._utilityService.detectChanges(this._cdr);
        }, 500);
      }
      else{
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      }
    })
    );
  }
  else {
    this.closeConfirmationPopUp();
    this.clearPopupObject();
  }
}

closeConfirmationPopUp(){
  $(this.confirmationPopUp.nativeElement).modal('hide');
  this._utilityService.detectChanges(this._cdr);
}

// for popup object clearing
clearPopupObject() {
  this.popupObject.id = null;
  // this.popupObject.title = '';
  // this.popupObject.subtitle = '';
  // this.popupObject.type = '';

}

// get perticuller risk category
getRiskCategory(id: number) {
  this._riskCategoryService.getItem(id).subscribe(res=>{
      this.loadPopup();
      this._utilityService.detectChanges(this._cdr);
    })
    
 
}
loadPopup()
{
  const riskCategorySingle: RiskCategory = RiskCategoryMasterStore.individualRiskCategoryId;
    
    this.riskCategoryObject.values = {
      id: riskCategorySingle.id,
      color_code:riskCategorySingle.color_code,
      title: riskCategorySingle.title,
      description: riskCategorySingle.description,
      
    }
    this.riskCategoryObject.type = 'Edit';
    this.openFormModal();
}

// for delete
delete(id: number) {
  // event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'Delete Risk Category?';
  this.popupObject.subtitle = 'common_delete_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');
}

// calling activcate function

activateRiskCategory(status: boolean) {
  if (status && this.popupObject.id) {

    this._riskCategoryService.activate(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.clearPopupObject();
    });
  }
  else {
    this.clearPopupObject();
  }
  setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('hide');
  }, 250);

}

// calling deactivate function

deactivateRiskCategory(status: boolean) {
  if (status && this.popupObject.id) {

    this._riskCategoryService.deactivate(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.clearPopupObject();
    });
  }
  else {
    this.clearPopupObject();
  }
  setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('hide');
  }, 250);

}
  sortTitle(type: string) {
    //RiskCategoryMasterStore.setCurrentPage(1);
    this._riskCategoryService.sortRiskCategoryList(type, null);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.riskCategorySubscriptionEvent.unsubscribe();
    this.popupControlRiskCategoryEventSubscription.unsubscribe();
    RiskCategoryMasterStore.searchText = '';
    RiskCategoryMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }
}
