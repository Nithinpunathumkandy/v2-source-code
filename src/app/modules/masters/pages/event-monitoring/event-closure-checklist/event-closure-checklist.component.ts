import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import{ EventClosureChecklistMasterStore} from '../../../../../stores/masters/event-monitoring/event-closure-checklist-store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from "src/app/stores/app.store";
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { EventClosureChecklistService } from 'src/app/core/services/masters/event-monitoring/event-closure-checklist/event-closure-checklist.service';
import { EventClosureChecklistSingle } from 'src/app/core/models/masters/event-monitoring/event-closure-checklist';

declare var $: any;

@Component({
  selector: 'app-event-closure-checklist',
  templateUrl: './event-closure-checklist.component.html',
  styleUrls: ['./event-closure-checklist.component.scss']
})
export class EventClosureChecklistComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  
  SubMenuItemStore = SubMenuItemStore;
  EventClosureChecklistMasterStore = EventClosureChecklistMasterStore;
  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_event_closure_checklist_message';

  eventClosureChecklistObject = {
    component: 'Master',
    type: null,
    values: null
  }

   popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  deleteEventSubscription: any;
  eventClosureChecklistSubscriptionEvent: any = null;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(
    private _eventClosureChecklistService: EventClosureChecklistService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2
  ) { }

  ngOnInit() {
    // This will run whenever the store observable or computed which are used in this function changes.
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_event_closure_checklist'});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'EVENT_CLOSURE_CHECKLIST_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_EVENT_CLOSURE_CHECKLIST', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_EVENT_CLOSURE_CHECKLIST', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_EVENT_CLOSURE_CHECKLIST', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_EVENT_CLOSURE_CHECKLIST', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_EVENT_CLOSURE_CHECKLIST', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path: 'event-monitoring'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_EVENT_CLOSURE_CHECKLIST')){
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
            this._eventClosureChecklistService.generateTemplate();
            break;
          case "export_to_excel":
            this._eventClosureChecklistService.exportToExcel();
            break;
            case "search":
              EventClosureChecklistMasterStore.searchText  = SubMenuItemStore.searchText;
              this.pageChange(1);
              break;
            case "share":
              ShareItemStore.setTitle('share_event_closure_checklist_title');
              ShareItemStore.formErrors = {};
              break;
            case "import":
              ImportItemStore.setTitle('import_event_closure_checklist');
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
        this._eventClosureChecklistService.shareData(ShareItemStore.shareData).subscribe(res=>{
            ShareItemStore.unsetShareData();
            ShareItemStore.setTitle('');
            ShareItemStore.unsetData();
            $('.modal-backdrop').remove();
            document.body.classList.remove('modal-open');
            setTimeout(() => {
              $(this.mailConfirmationPopup.nativeElement).modal('show');              
            }, 200);
        },(error)=>{
          if (error.status == 422){
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
        this._eventClosureChecklistService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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

    this.eventClosureChecklistSubscriptionEvent = this._eventEmitterService.eventClosureChecklist.subscribe(res=>{
      this.closeFormModal();
    })
    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
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
    this.eventClosureChecklistObject.type = 'Add';
    this.eventClosureChecklistObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  pageChange(newPage: number = null) {
    if (newPage) EventClosureChecklistMasterStore.setCurrentPage(newPage);
    this._eventClosureChecklistService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

   // Delte New Modal
// modal Control event
modalControl(status: boolean) {
  switch (this.popupObject.type) {
    case '': this.deleteEventClosureChecklist(status)
      break;

    case 'Activate': this.activateEventClosureChecklist(status)
      break;

    case 'Deactivate': this.deactivateEventClosureChecklist(status)
      break;

  }

}


 // delete function call
 deleteEventClosureChecklist(status: boolean) {
  if (status && this.popupObject.id) {
    this._eventClosureChecklistService.delete(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    },(error=>{
      if(error.status == 405 && EventClosureChecklistMasterStore.getEventClosureChecklistById(this.popupObject.id).status_id == AppStore.activeStatusId){
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
 
}

// calling activcate function
activateEventClosureChecklist(status: boolean) {
  if (status && this.popupObject.id) {

    this._eventClosureChecklistService.activate(this.popupObject.id).subscribe(resp => {
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
deactivateEventClosureChecklist(status: boolean) {
  if (status && this.popupObject.id) {

    this._eventClosureChecklistService.deactivate(this.popupObject.id).subscribe(resp => {
 
        this._utilityService.detectChanges(this._cdr);
      
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
  this.popupObject.type = 'Activate';
  this.popupObject.id = id;
  this.popupObject.title = 'activate_event_closure_checklist';
  this.popupObject.subtitle = 'common_activate_subtitle';
  $(this.confirmationPopUp.nativeElement).modal('show');
}

// for deactivate
deactivate(id: number) {
  this.popupObject.type = 'Deactivate';
  this.popupObject.id = id;
  this.popupObject.title = 'deactivate_event_closure_checklist';
  this.popupObject.subtitle = 'common_deactivate_subtitle';
  $(this.confirmationPopUp.nativeElement).modal('show');
}

// for delete
delete(id: number) {
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'delete_event_closure_checklist';
  this.popupObject.subtitle = 'common_delete_subtitle';
  $(this.confirmationPopUp.nativeElement).modal('show');
}

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.eventClosureChecklistObject.type = null;
  }


  getEventClosureChecklist(id: number)  {
    this._eventClosureChecklistService.getItem(id).subscribe(res=>{

        this.loadPopup();
        this._utilityService.detectChanges(this._cdr);
      })
      
  
  }


  loadPopup()
  {
   
    const eventClosureChecklistSingle: EventClosureChecklistSingle = EventClosureChecklistMasterStore.individualEventClosureChecklistId;
      
    this.eventClosureChecklistObject.values = {
      id: eventClosureChecklistSingle.id,
      languages: eventClosureChecklistSingle.languages,
            
    }
   
    this.eventClosureChecklistObject.type = 'Edit';
    this.openFormModal();
  }


  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    this.eventClosureChecklistSubscriptionEvent.unsubscribe();
    EventClosureChecklistMasterStore.searchText = '';
    EventClosureChecklistMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

   // for sorting
 sortTitle(type: string) {
  this._eventClosureChecklistService.sortEventClosureChecklistList(type, SubMenuItemStore.searchText);
  this.pageChange();
}
}
