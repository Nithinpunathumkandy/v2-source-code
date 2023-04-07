import { Component, OnInit , ChangeDetectorRef , Renderer2 , ViewChild , ElementRef  } from '@angular/core';
import { KeyRiskIndicatorsMasterStore } from 'src/app/stores/masters/risk-management/key-risk-indicators-master-store';
import { KeyRisk } from 'src/app/core/models/masters/risk-management/key-risk-indicators';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { KeyriskindicatorsService } from 'src/app/core/services/masters/risk-management/key-risk-indicators/keyriskindicators.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { ImportItemStore } from "src/app/stores/general/import-item.store";

@Component({
  selector: 'app-kri-master',
  templateUrl: './kri-master.component.html',
  styleUrls: ['./kri-master.component.scss']
})
export class KriMasterComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  KeyRiskIndicatorsMasterStore = KeyRiskIndicatorsMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_kri_message';

  keyRiskObject = {
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
 
  keyRiskIndicatorSubscriptionEvent: any = null;
  popupControlkeyRiskEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _keyRiskIndicatorsService:KeyriskindicatorsService
  ) { }

  ngOnInit(): void {

    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_key_risk_indicator'});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'KEY_RISK_INDICATOR_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_KEY_RISK_INDICATOR', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_KEY_RISK_INDICATOR_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_KEY_RISK_INDICATOR', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_KEY_RISK_INDICATOR', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_KEY_RISK_INDICATOR', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path: 'risk-management'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_KEY_RISK_INDICATOR')){
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
                 this._keyRiskIndicatorsService.generateTemplate();
                 break;
               case "export_to_excel":
                 this._keyRiskIndicatorsService.exportToExcel();
                 break;
               case "search":
                 KeyRiskIndicatorsMasterStore.searchText = SubMenuItemStore.searchText;
                 this.pageChange(1);
                 break;
               case "share":
                 ShareItemStore.setTitle('share_risk_key_risk_indicator_title');
                 ShareItemStore.formErrors = {};
                 break;
               case "import":
                 ImportItemStore.setTitle('import_risk_key_risk_indicator');
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
              this._keyRiskIndicatorsService.shareData(ShareItemStore.shareData).subscribe(res=>{
                  ShareItemStore.unsetShareData();
                  ShareItemStore.setTitle('');
                  ShareItemStore.unsetData();
                  $('.modal-backdrop').remove();
                  document.body.classList.remove('modal-open');
                  setTimeout(() => {
                    ($(this.mailConfirmationPopup.nativeElement)as any).modal('show');              
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
              this._keyRiskIndicatorsService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
       this.popupControlkeyRiskEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
         this.modalControl(item);
       })
       this.keyRiskIndicatorSubscriptionEvent = this._eventEmitterService.keyRiskIndicator.subscribe(res => {
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
    if (newPage) KeyRiskIndicatorsMasterStore.setCurrentPage(newPage);
    this._keyRiskIndicatorsService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  addNewItem(){
    this.keyRiskObject.type = 'Add';
    this.keyRiskObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      ($(this.formModal.nativeElement)as any).modal('show');
    }, 50);
  }

  closeFormModal() {
    ($(this.formModal.nativeElement)as any).modal('hide');
    this.keyRiskObject.type = null;
  }

  getKeyRisk(id: number) {
    this._keyRiskIndicatorsService.getItem(id).subscribe(res=>{

          this.loadPopup();
          this._utilityService.detectChanges(this._cdr);
        
      })
   
  }

  loadPopup()
{
  const keyRiskSingle: KeyRisk = KeyRiskIndicatorsMasterStore.individualKeyRiskId;
        
        this.keyRiskObject.values = {
          id: keyRiskSingle.id,
          title: keyRiskSingle.title,
          description: keyRiskSingle.description,
          risk_category_id:keyRiskSingle.risk_category?.id,
          // unit:keyRiskSingle.unit,
          unit:keyRiskSingle.unit?.id
          
        }
        this.keyRiskObject.type = 'Edit';
        this.openFormModal();
        console.log(this.keyRiskObject.values);
        
}

delete(id: number) {
  // event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'Delete Risk Source?';
  this.popupObject.subtitle = 'common_delete_subtitle';

  ($(this.confirmationPopUp.nativeElement)as any).modal('show');

}

  activate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Key Risk Indicator?';
    this.popupObject.subtitle = 'common_activate_subtitle';
  
    ($(this.confirmationPopUp.nativeElement)as any).modal('show');
  }

  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Key Risk Indicator?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';
  
    ($(this.confirmationPopUp.nativeElement)as any).modal('show');
  }

  // delete function call
  deleteKeyRisk(status: boolean) {
    if (status && this.popupObject.id) {
      this._keyRiskIndicatorsService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && KeyRiskIndicatorsMasterStore.getKeyRiskById(this.popupObject.id).status_id == AppStore.activeStatusId){
          let id = this.popupObject.id;
          this.closeConfirmationPopUp();
          this.clearPopupObject();
          setTimeout(() => {
            //this.deactivate(id);
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
    ($(this.confirmationPopUp.nativeElement)as any).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  clearPopupObject() {
    this.popupObject.id = null;
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';
  
  }

  // calling activcate function
  
  activateKeyRisk(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._keyRiskIndicatorsService.activate(this.popupObject.id).subscribe(resp => {
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
      ($(this.confirmationPopUp.nativeElement)as any).modal('hide');
    }, 250);
  
  }
  
  // calling deactivate function
  
  deactivateKeyRisk(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._keyRiskIndicatorsService.deactivate(this.popupObject.id).subscribe(resp => {
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
      ($(this.confirmationPopUp.nativeElement)as any).modal('hide');
    }, 250);
  
  }
  

  sortTitle(type){
    this._keyRiskIndicatorsService.sortKRIList(type, null);
  this.pageChange();
  }

  // modal control event
  modalControl(status: boolean) {
     switch (this.popupObject.type) {
       case '': this.deleteKeyRisk(status)
       break;
     
       case 'Activate': this.activateKeyRisk(status)
         break;
  
       case 'Deactivate': this.deactivateKeyRisk(status)
         break;
  
     }
  
  }
  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.keyRiskIndicatorSubscriptionEvent.unsubscribe();
    this.popupControlkeyRiskEventSubscription.unsubscribe();
    KeyRiskIndicatorsMasterStore.searchText = null;
    KeyRiskIndicatorsMasterStore.searchText = '';
    KeyRiskIndicatorsMasterStore.currentPage = 1 ;
  }

}
