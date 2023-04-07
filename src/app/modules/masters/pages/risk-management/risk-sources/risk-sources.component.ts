import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy, Renderer2 } from '@angular/core';
import{RiskSourceMasterStore} from 'src/app/stores/masters/risk-management/risk-source-store';
import { RiskSource } from 'src/app/core/models/masters/risk-management/risk-source';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RiskSourceService } from 'src/app/core/services/masters/risk-management/risk-source/risk-source.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { ImportItemStore } from "src/app/stores/general/import-item.store";


declare var $: any;

@Component({
  selector: 'app-risk-sources',
  templateUrl: './risk-sources.component.html',
  styleUrls: ['./risk-sources.component.scss']
})
export class RiskSourcesComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  RiskSourceMasterStore = RiskSourceMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_risk_source_message';

  riskSourceObject = {
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
 
  riskSourceSubscriptionEvent: any = null;
  popupControlRiskSourceEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(  private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _riskSourceService: RiskSourceService){}

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_risk_source'});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'RISK_SOURCE_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_RISK_SOURCE', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_RISK_SOURCE_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_RISK_SOURCE', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_RISK_SOURCE', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_RISK_SOURCE', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path: 'risk-management'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_RISK_SOURCE')){
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
                this._riskSourceService.generateTemplate();
                break;
              case "export_to_excel":
                this._riskSourceService.exportToExcel();
                break;
              case "search":
                RiskSourceMasterStore.searchText = SubMenuItemStore.searchText;
                this.pageChange(1);
                break;
              case "share":
                ShareItemStore.setTitle('share_risk_source_title');
                ShareItemStore.formErrors = {};
                break;
              case "import":
                ImportItemStore.setTitle('import_risk_source');
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
            this._riskSourceService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
            this._riskSourceService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
      this.popupControlRiskSourceEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })
      this.riskSourceSubscriptionEvent = this._eventEmitterService.riskSource.subscribe(res => {
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
    this.riskSourceObject.type = 'Add';
    this.riskSourceObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) RiskSourceMasterStore.setCurrentPage(newPage);
    this._riskSourceService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.riskSourceObject.type = null;
    this.riskSourceObject.values = null;
  }

  activate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Risk Source?';
    this.popupObject.subtitle = 'common_activate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Risk Source?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  
  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteRiskSource(status)
      break;
      
      case 'Activate': this.activateRiskSource(status)
        break;
  
      case 'Deactivate': this.deactivateRiskSource(status)
        break;
  
    }
  
  }
  

  // delete function call
  deleteRiskSource(status: boolean) {
    if (status && this.popupObject.id) {
      this._riskSourceService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && RiskSourceMasterStore.getRiskSourceById(this.popupObject.id).status_id == AppStore.activeStatusId){
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
 // get perticuller risk source
  getRiskSource(id: number) {
    this._riskSourceService.getItem(id).subscribe(res=>{

          this.loadPopup();
          this._utilityService.detectChanges(this._cdr);
        
      })
   
  }
loadPopup()
{
  const riskSourceSingle: RiskSource = RiskSourceMasterStore.individualRiskSourceId;
        
        this.riskSourceObject.values = {
          id: riskSourceSingle.id,
          color_code:riskSourceSingle.color_code,
          title: riskSourceSingle.title,
          description: riskSourceSingle.description,
          
        }
        this.riskSourceObject.type = 'Edit';
        this.openFormModal();
}
  // for delete
delete(id: number) {
  // event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'Delete Risk Source?';
  this.popupObject.subtitle = 'common_delete_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');

}
  
  // calling activcate function
  
  activateRiskSource(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._riskSourceService.activate(this.popupObject.id).subscribe(resp => {
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
  
  deactivateRiskSource(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._riskSourceService.deactivate(this.popupObject.id).subscribe(resp => {
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
      //RiskSourceMasterStore.setCurrentPage(1);
      this._riskSourceService.sortRiskSourceList(type, null);
      this.pageChange();
    }
  
    ngOnDestroy() {
      // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.riskSourceSubscriptionEvent.unsubscribe();
      this.popupControlRiskSourceEventSubscription.unsubscribe();
      RiskSourceMasterStore.searchText = '';
      RiskSourceMasterStore.currentPage = 1 ;
      this.idleTimeoutSubscription.unsubscribe();
      this.networkFailureSubscription.unsubscribe();
    }
  

}
