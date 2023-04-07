import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { IncidentRootCause } from 'src/app/core/models/masters/incident-management/incident-root-cause';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { IncidentRootCauseService } from 'src/app/core/services/masters/incident-management/incident-root-cause/incident-root-cause.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IncidentRootCauseMasterStore } from 'src/app/stores/masters/incident-management/incident-root-cause-master-store';

declare var $: any;
@Component({
  selector: 'app-incident-root-cause',
  templateUrl: './incident-root-cause.component.html',
  styleUrls: ['./incident-root-cause.component.scss']
})
export class IncidentRootCauseComponent implements OnInit , OnDestroy {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  IncidentRootCauseMasterStore = IncidentRootCauseMasterStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_incident_root_cause_message';

  incidentRootCauseObject = {
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

  incidentRootCauseSubscriptionEvent: any = null;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  popupControlIncidentRootCauseEventSubscription: any;

  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _incidentRootCauseService: IncidentRootCauseService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_incident_root_cause'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'INCIDENT_ROOT_CAUSE_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_INCIDENT_ROOT_CAUSE', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_INCIDENT_ROOT_CAUSE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_INCIDENT_ROOT_CAUSE', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_INCIDENT_ROOT_CAUSE', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_INCIDENT_ROOT_CAUSE', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path:'incident-management'}},
      ]
      if(!AuthStore.getActivityPermission(1100,'CREATE_INCIDENT_ROOT_CAUSE')){
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
            this._incidentRootCauseService.generateTemplate();
            break;
          case "export_to_excel":
            this._incidentRootCauseService.exportToExcel();
            break;
          case "search":
            IncidentRootCauseMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_incident_root_cause_title');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_incident_root_cause');
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
        this._incidentRootCauseService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._incidentRootCauseService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
    this.popupControlIncidentRootCauseEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.incidentRootCauseSubscriptionEvent = this._eventEmitterService.incidentRootCauseModalControl.subscribe(res => {
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

    // IncidentRootCauseMasterStore.setOrderBy('asc');
    this.pageChange(1);
  
  }
  addNewItem(){
    this.incidentRootCauseObject.type = 'Add';
    this.incidentRootCauseObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) IncidentRootCauseMasterStore.setCurrentPage(newPage);
    this._incidentRootCauseService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
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
    this.incidentRootCauseObject.type = null;
  }
  getIncidentRootCause(id: number) {
    const incidentRootCause: IncidentRootCause = IncidentRootCauseMasterStore.getIncidentRootCauseById(id);
    //set form value
    this.incidentRootCauseObject.values = {
      id: incidentRootCause.id,
      title: incidentRootCause.title,
      description: incidentRootCause.description,
    }
    this.incidentRootCauseObject.type = 'Edit';
    this.openFormModal();
  }
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteIncidentRootCause(status)
        break;

      case 'Activate': this.activateIncidentRootCause(status)
        break;

      case 'Deactivate': this.deactivateIncidentRootCause(status)
        break;

    }
  }
   // delete function call
   deleteIncidentRootCause(status: boolean) {
    if (status && this.popupObject.id) {
      this._incidentRootCauseService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && IncidentRootCauseMasterStore.getIncidentRootCauseById(this.popupObject.id).status_id == AppStore.activeStatusId){
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

 activateIncidentRootCause(status: boolean) {
  if (status && this.popupObject.id) {

    this._incidentRootCauseService.activate(this.popupObject.id).subscribe(resp => {
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

deactivateIncidentRootCause(status: boolean) {
  if (status && this.popupObject.id) {

    this._incidentRootCauseService.deactivate(this.popupObject.id).subscribe(resp => {
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
  this.popupObject.title = 'Activate IncidentRootCause?';
  this.popupObject.subtitle = 'common_activate_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for deactivate
deactivate(id: number) {
  // event.stopPropagation();
  this.popupObject.type = 'Deactivate';
  this.popupObject.id = id;
  this.popupObject.title = 'Deactivate IncidentRootCause?';
  this.popupObject.subtitle = 'common_deactivate_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for delete
delete(id: number) {
  // event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'Delete IncidentRootCause?';
  this.popupObject.subtitle = 'common_delete_subtitle';

  $(this.confirmationPopUp.nativeElement).modal('show');

}
   // for sorting
   sortTitle(type: string) {
    this._incidentRootCauseService.sortIncidentRootCauseList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }
  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.incidentRootCauseSubscriptionEvent.unsubscribe();
    this.popupControlIncidentRootCauseEventSubscription.unsubscribe();
    IncidentRootCauseMasterStore.searchText = '';
    IncidentRootCauseMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

}
