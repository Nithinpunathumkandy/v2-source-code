import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IReactionDisposer,autorun } from 'mobx';
import { RiskSubCategory } from 'src/app/core/models/masters/risk-management/risk-sub-category';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RiskSubCategoryService } from 'src/app/core/services/masters/risk-management/risk-sub-category/risk-sub-category.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { RiskSubCategoryMasterStore } from 'src/app/stores/masters/risk-management/risk-sub-category-store';
declare var $: any;

@Component({
  selector: 'app-risk-sub-category',
  templateUrl: './risk-sub-category.component.html',
  styleUrls: ['./risk-sub-category.component.scss']
})
export class RiskSubCategoryComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  RiskSubCategoryMasterStore = RiskSubCategoryMasterStore;
  AuthStore = AuthStore;
  SubMenuItemStore = SubMenuItemStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_risk_sub_category_message';

  reactionDisposer: IReactionDisposer;
  riskSubCategorySubscriptionEvent: any = null;
  popupControlRiskCategoryEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  
  riskSubCategoryObject = {
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
  constructor( private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _riskSubCategoryService: RiskSubCategoryService) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_risk_sub_category'});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'RISK_SUB_CATEGORY_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_RISK_SUB_CATEGORY', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_RISK_SUB_CATEGORY_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_RISK_SUB_CATEGORY', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_RISK_SUB_CATEGORY', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_RISK_SUB_CATEGORY', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path: 'risk-management'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_RISK_SUB_CATEGORY')){
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
                this._riskSubCategoryService.generateTemplate();
                break;
              case "export_to_excel":
                this._riskSubCategoryService.exportToExcel();
                break;
              case "search":
                RiskSubCategoryMasterStore.searchText = SubMenuItemStore.searchText;
                this.pageChange(1);
                break;
              case "share":
                ShareItemStore.setTitle('share_risk_sub_category_title');
                ShareItemStore.formErrors = {};
                break;
              case "import":
                ImportItemStore.setTitle('import_risk_sub_category');
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
            this._riskSubCategoryService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
            this._riskSubCategoryService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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

        this.popupControlRiskCategoryEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
          this.modalControl(item);
        })

        this.riskSubCategorySubscriptionEvent = this._eventEmitterService.riskSubCategory.subscribe(res => {
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

  pageChange(newPage: number = null) {
    if (newPage) RiskSubCategoryMasterStore.setCurrentPage(newPage);
    this._riskSubCategoryService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  addNewItem(){
    this.riskSubCategoryObject.type = 'Add';
    this.riskSubCategoryObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.riskSubCategoryObject.values = null;
    this.riskSubCategoryObject.type = null;
  }

  // for delete
delete(id: number) {
  // event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'Delete Risk Sub Category?';
  this.popupObject.subtitle = 'common_delete_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');
}

  // for activate 
activate(id: number) {
  // event.stopPropagation();
  this.popupObject.type = 'Activate';
  this.popupObject.id = id;
  this.popupObject.title = 'Activate Risk Sub Category?';
  this.popupObject.subtitle = 'common_activate_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for deactivate
deactivate(id: number) {
  // event.stopPropagation();
  this.popupObject.type = 'Deactivate';
  this.popupObject.id = id;
  this.popupObject.title = 'Deactivate Risk Sub Category?';
  this.popupObject.subtitle = 'common_deactivate_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');
}

// modal control event
modalControl(status: boolean) {
  switch (this.popupObject.type) {
    case '': this.deleteRiskSubCategory(status)
    break;
    case 'Activate': this.activateRiskSubCategory(status)
      break;

    case 'Deactivate': this.deactivateRiskSubCategory(status)
      break;

  }
}

// delete function call
deleteRiskSubCategory(status: boolean) {
  if (status && this.popupObject.id) {
    this._riskSubCategoryService.delete(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.closeConfirmationPopUp();
    },(error=>{
      if(error.status == 405 && RiskSubCategoryMasterStore.getRiskSubCategoryById(this.popupObject.id).status_id == AppStore.activeStatusId){
        let id = this.popupObject.id;
        this.closeConfirmationPopUp();
        setTimeout(() => {
          this.deactivate(id);
          this._utilityService.detectChanges(this._cdr);
        }, 500);
      }
      else{
        this.closeConfirmationPopUp();
      }
    })
    );
  }
  else {
    this.closeConfirmationPopUp();
  }
}

activateRiskSubCategory(status: boolean) {
  if (status && this.popupObject.id) {

    this._riskSubCategoryService.activate(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.popupObject.id = null;
    });
  }
  else {
    this.popupObject.id = null;
  }
  setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('hide');
  }, 250);
}

deactivateRiskSubCategory(status: boolean) {
  if (status && this.popupObject.id) {

    this._riskSubCategoryService.deactivate(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.popupObject.id = null;
    });
  }
  else {
    this.popupObject.id = null;
  }
  setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('hide');
  }, 250);
}

closeConfirmationPopUp(){
  this.popupObject.id = null;
  $(this.confirmationPopUp.nativeElement).modal('hide');
  this._utilityService.detectChanges(this._cdr);
}

getRiskSubCategory(id: number) {
    this._riskSubCategoryService.getItem(id).subscribe(res => {
      let riskSubCategorySingle = RiskSubCategoryMasterStore.individualRiskSubCategoryId;
      this.riskSubCategoryObject.values = {
        id: riskSubCategorySingle.id,
        risk_category_id:riskSubCategorySingle.risk_category.id,
        title: riskSubCategorySingle.title,
        description: riskSubCategorySingle.description,
      }
      this.riskSubCategoryObject.type = 'Edit';
      this.openFormModal();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  sortTitle(type: string) {
    this._riskSubCategoryService.sortRiskSubCategoryList(type, null);
    this.pageChange();
  }

}
