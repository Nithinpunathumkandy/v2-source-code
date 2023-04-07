import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy, Renderer2 } from '@angular/core';
import{RiskAreaMasterStore} from 'src/app/stores/masters/risk-management/risk-area-store';
import { RiskArea } from 'src/app/core/models/masters/risk-management/risk-area';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RiskAreaService } from 'src/app/core/services/masters/risk-management/risk-area/risk-area.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { ImportItemStore } from "src/app/stores/general/import-item.store";


declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-risk-area',
  templateUrl: './risk-area.component.html',
  styleUrls: ['./risk-area.component.scss']
})
export class RiskAreaComponent implements OnInit, OnDestroy {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  RiskAreaMasterStore = RiskAreaMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_risk_area_message';

  riskAreaObject = {
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
 
  riskAreaSubscriptionEvent: any = null;
  popupControlRiskAreaEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(  private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _riskAreaService: RiskAreaService){}

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_risk_area'});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'RISK_AREA_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_RISK_AREA', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_RISK_AREA_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_RISK_AREA', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_RISK_AREA', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_RISK_AREA', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path: 'risk-management'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_RISK_AREA')){
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
                this._riskAreaService.generateTemplate();
                break;
              case "export_to_excel":
                this._riskAreaService.exportToExcel();
                break;
              case "search":
                RiskAreaMasterStore.searchText = SubMenuItemStore.searchText;
                this.pageChange(1);
                break;
              case "share":
                ShareItemStore.setTitle('share_risk_area_title');
                ShareItemStore.formErrors = {};
                break;
              case "import":
                ImportItemStore.setTitle('import_risk_area');
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
            this._riskAreaService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
            this._riskAreaService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
      this.popupControlRiskAreaEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })
      this.riskAreaSubscriptionEvent = this._eventEmitterService.riskArea.subscribe(res => {
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
    this.riskAreaObject.type = 'Add';
    this.riskAreaObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) RiskAreaMasterStore.setCurrentPage(newPage);
    this._riskAreaService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.riskAreaObject.type = null;
  }

  activate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Risk Area?';
    this.popupObject.subtitle = 'common_activate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Risk Area?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  
  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteRiskArea(status)
      break;
      
      case 'Activate': this.activateRiskArea(status)
        break;
  
      case 'Deactivate': this.deactivateRiskArea(status)
        break;
  
    }
  
  }
  

  // delete function call
  deleteRiskArea(status: boolean) {
    if (status && this.popupObject.id) {
      this._riskAreaService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && RiskAreaMasterStore.getRiskAreaById(this.popupObject.id).status_id == AppStore.activeStatusId){
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
 // get perticuller risk area
  getRiskArea(id: number) {
    this._riskAreaService.getItem(id).subscribe(res=>{

          this.loadPopup();
          this._utilityService.detectChanges(this._cdr);
        
      })
   
  }
loadPopup()
{
  const riskAreaSingle: RiskArea = RiskAreaMasterStore.individualRiskAreaId;
        
        this.riskAreaObject.values = {
          id: riskAreaSingle.id,
          title: riskAreaSingle.title,
          description: riskAreaSingle.description,
          
        }
        this.riskAreaObject.type = 'Edit';
        this.openFormModal();
}
  // for delete
delete(id: number) {
  // event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'Delete Risk Area?';
  this.popupObject.subtitle = 'common_delete_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');

}
  
  // calling activcate function
  
  activateRiskArea(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._riskAreaService.activate(this.popupObject.id).subscribe(resp => {
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
  
  deactivateRiskArea(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._riskAreaService.deactivate(this.popupObject.id).subscribe(resp => {
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
      //RiskAreaMasterStore.setCurrentPage(1);
      this._riskAreaService.sortRiskAreaList(type, null);
      this.pageChange();
    }
  
    ngOnDestroy() {
      // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.riskAreaSubscriptionEvent.unsubscribe();
      this.popupControlRiskAreaEventSubscription.unsubscribe();
      RiskAreaMasterStore.searchText = '';
      RiskAreaMasterStore.currentPage = 1 ;
      this.idleTimeoutSubscription.unsubscribe();
      this.networkFailureSubscription.unsubscribe();
    }
  

}
