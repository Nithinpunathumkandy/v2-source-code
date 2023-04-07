import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import{EventEquipmentMasterStore} from '../../../../../stores/masters/event-monitoring/event-equipment-store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from "src/app/stores/app.store";
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { EventEquipmentService } from 'src/app/core/services/masters/event-monitoring/event-equipment/event-equipment.service';
import { EventEquipmentSingle } from 'src/app/core/models/masters/event-monitoring/event-equipment';

declare var $: any;

@Component({
  selector: 'app-event-equipment',
  templateUrl: './event-equipment.component.html',
  styleUrls: ['./event-equipment.component.scss']
})
export class EventEquipmentComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  
  SubMenuItemStore = SubMenuItemStore;
  EventEquipmentMasterStore = EventEquipmentMasterStore;
  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_event_equipment_message';

  eventEquipmentObject = {
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
  eventEquipmentSubscriptionEvent: any = null;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(
    private _eventEquipmentService: EventEquipmentService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2
  ) { }

  ngOnInit() {
    // This will run whenever the store observable or computed which are used in this function changes.
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_event_equipment'});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'EVENT_EQUIPMENT_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_EVENT_EQUIPMENT', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_EVENT_EQUIPMENT', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_EVENT_EQUIPMENT', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_EVENT_EQUIPMENT', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_EVENT_EQUIPMENT', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path: 'event-monitoring'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_EVENT_EQUIPMENT')){
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
            this._eventEquipmentService.generateTemplate();
            break;
          case "export_to_excel":
            this._eventEquipmentService.exportToExcel();
            break;
            case "search":
              EventEquipmentMasterStore.searchText  = SubMenuItemStore.searchText;
              this.pageChange(1);
              break;
            case "share":
              ShareItemStore.setTitle('share_event_equipment_title');
              ShareItemStore.formErrors = {};
              break;
            case "import":
              ImportItemStore.setTitle('import_event_equipment');
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
        this._eventEquipmentService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._eventEquipmentService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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

    this.eventEquipmentSubscriptionEvent = this._eventEmitterService.eventEquipment.subscribe(res=>{
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
    this.eventEquipmentObject.type = 'Add';
    this.eventEquipmentObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  pageChange(newPage: number = null) {
    if (newPage) EventEquipmentMasterStore.setCurrentPage(newPage);
    this._eventEquipmentService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

   // Delte New Modal
// modal Control event
modalControl(status: boolean) {
  switch (this.popupObject.type) {
    case '': this.deleteEventEquipment(status)
      break;

    case 'Activate': this.activateEventEquipment(status)
      break;

    case 'Deactivate': this.deactivateEventEquipment(status)
      break;

  }

}


 // delete function call
 deleteEventEquipment(status: boolean) {
  if (status && this.popupObject.id) {
    this._eventEquipmentService.delete(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    },(error=>{
      if(error.status == 405 && EventEquipmentMasterStore.getEventEquipmentById(this.popupObject.id).status_id == AppStore.activeStatusId){
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
activateEventEquipment(status: boolean) {
  if (status && this.popupObject.id) {

    this._eventEquipmentService.activate(this.popupObject.id).subscribe(resp => {
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
deactivateEventEquipment(status: boolean) {
  if (status && this.popupObject.id) {

    this._eventEquipmentService.deactivate(this.popupObject.id).subscribe(resp => {
 
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
  this.popupObject.title = 'activate_event_equipment';
  this.popupObject.subtitle = 'common_activate_subtitle';
  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for deactivate
deactivate(id: number) {
  this.popupObject.type = 'Deactivate';
  this.popupObject.id = id;
  this.popupObject.title = 'deactivate_event_equipment';
  this.popupObject.subtitle = 'common_deactivate_subtitle';
  $(this.confirmationPopUp.nativeElement).modal('show');
}
// for delete
delete(id: number) {
  //event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'delete_event_equipment';
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
    this.eventEquipmentObject.type = null;
  }

    
  getEventEquipment(id: number)  {
    this._eventEquipmentService.getItem(id).subscribe(res=>{

        this.loadPopup();
        this._utilityService.detectChanges(this._cdr);
      })
      
  
  }


  loadPopup()
  {
   
    const eventEquipmentSingle: EventEquipmentSingle = EventEquipmentMasterStore.individualEventEquipmentId;
      
    this.eventEquipmentObject.values = {
      id: eventEquipmentSingle.id,
      languages: eventEquipmentSingle.languages,
            
    }
   
    this.eventEquipmentObject.type = 'Edit';
    this.openFormModal();
  }


  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    this.eventEquipmentSubscriptionEvent.unsubscribe();
    EventEquipmentMasterStore.searchText = '';
    EventEquipmentMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

   // for sorting
 sortTitle(type: string) {
  this._eventEquipmentService.sortEventEquipmentList(type, SubMenuItemStore.searchText);
  this.pageChange();
}
}
