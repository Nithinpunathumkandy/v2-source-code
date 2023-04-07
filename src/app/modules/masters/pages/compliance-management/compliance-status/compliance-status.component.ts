import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ComplianceStatusService } from 'src/app/core/services/masters/compliance-management/compliance-status/compliance-status.service';
import { LanguageService } from 'src/app/core/services/settings/languages/language.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ComplianceStatusMasterStore } from 'src/app/stores/masters/compliance-management/compliance-status-store';
import { LanguageSettingsStore } from 'src/app/stores/settings/language-settings.store';

declare var $: any;
@Component({
  selector: 'app-compliance-status',
  templateUrl: './compliance-status.component.html',
  styleUrls: ['./compliance-status.component.scss']
})
export class ComplianceStatusComponent implements OnInit , OnDestroy{
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('titleInput') titleInput: ElementRef;

  complianceStatusObject = {
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

  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  LanguageSettingsStore = LanguageSettingsStore;
  ComplianceStatusMasterStore = ComplianceStatusMasterStore;
  idleTimeoutSubscription:any;
  networkFailureSubscription:any;
  complianceStatusSubscriptionEvent:any;
  popupControlComplianceStatusEventSubscription:any;

  constructor(private _languageService:LanguageService,
              private _utilityService:UtilityService,
              private _cdr:ChangeDetectorRef,
              private _complianceStatusService:ComplianceStatusService,
              private _renderer2:Renderer2,
              private _eventEmitterService:EventEmitterService,
              private _helperService:HelperServiceService) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_compliance_status'});
    this.getLanguage();

    // This will run whenever the store observable or computed which are used in this function changes.
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'COMPLIANCE_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_COMPLIANCE_STATUS', submenuItem: {type: 'new_modal'}},
        // {activityName: 'GENERATE_COMPLIANCE_STATUS', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_COMPLIANCE_STATUS', submenuItem: {type: 'export_to_excel'}},
        // {activityName: 'IMPORT_COMPLIANCE_STATUS', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path: 'compliance-management'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_COMPLIANCE_STATUS')){
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
           this._complianceStatusService.generateTemplate();
            break;
          case "export_to_excel":
            this._complianceStatusService.exportToExcel();
            break;
          case "search":
            ComplianceStatusMasterStore.searchTerm = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "import":
            ImportItemStore.setTitle('import_label');
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
      if(ImportItemStore.importClicked){
        ImportItemStore.importClicked = false;
        this._complianceStatusService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
     this.popupControlComplianceStatusEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

     // for closing the modal
     this.complianceStatusSubscriptionEvent = this._eventEmitterService.complianceStatusControl.subscribe(res => {
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


    // ComplianceStatusMasterStore.setOrderBy('asc');
    this.pageChange(1);
  }
  addNewItem(){
    this.complianceStatusObject.type = 'Add';
    this.complianceStatusObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

   // for opening modal
   openFormModal() {

    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }
  // for close modal
  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.complianceStatusObject.type = null;
  }
  pageChange(newPage: number = null) {
    if (newPage) ComplianceStatusMasterStore.setCurrentPage(newPage);
    this._complianceStatusService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getLanguage(){
    // if(!LanguageSettingsStore.languages){
      this._languageService.getAllItems(true).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    // }
  }


  // modal control event
modalControl(status: boolean) {
  switch (this.popupObject.type) {
    case '': this.deleteComplianceStatus(status)
      break;

    case 'Activate': this.activateComplianceStatus(status)
      break;

    case 'Deactivate': this.deactivateComplianceStatus(status)
      break;

  }

}


// delete function call
deleteComplianceStatus(status: boolean) {
  if (status && this.popupObject.id) {
    this._complianceStatusService.delete(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    },(error=>{
      if(error.status == 405 && ComplianceStatusMasterStore.getComplianceStatusById(this.popupObject.id).status_id == AppStore.activeStatusId){
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

// calling activcate function

activateComplianceStatus(status: boolean) {
  if (status && this.popupObject.id) {

    this._complianceStatusService.activate(this.popupObject.id).subscribe(resp => {
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

deactivateComplianceStatus(status: boolean) {
  if (status && this.popupObject.id) {

    this._complianceStatusService.deactivate(this.popupObject.id).subscribe(resp => {
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

// for activate 
activate(id: number) {
  // event.stopPropagation();
  this.popupObject.type = 'Activate';
  this.popupObject.id = id;
  this.popupObject.title = 'Activate Compliance Status?';
  this.popupObject.subtitle = 'are_you_sure_activate';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for deactivate
deactivate(id: number) {
  // event.stopPropagation();
  this.popupObject.type = 'Deactivate';
  this.popupObject.id = id;
  this.popupObject.title = 'Deactivate Compliance Status?';
  this.popupObject.subtitle = 'are_you_sure_deactivate';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for delete
delete(id: number) {
  // event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'Delete Compliance Status?';
  this.popupObject.subtitle = 'are_you_sure_delete';

  $(this.confirmationPopUp.nativeElement).modal('show');

}
   // for sorting
   sortTitle(type: string) {
    // LabelMasterStore.setCurrentPage(1);
    this._complianceStatusService.sortStatusList(type, null);
    this.pageChange();
  }
  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.complianceStatusSubscriptionEvent.unsubscribe();
    this.popupControlComplianceStatusEventSubscription.unsubscribe();
    // ComplianceStatusMasterStore.searchText = '';
    ComplianceStatusMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }
}
