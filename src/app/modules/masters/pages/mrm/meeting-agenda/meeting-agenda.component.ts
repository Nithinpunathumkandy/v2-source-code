import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy, Renderer2 } from '@angular/core';
import { MeetingAgenda, MeetingAgendaDetails } from 'src/app/core/models/masters/mrm/meeting-agenda';
import{MeetingAgendaMasterStore} from 'src/app/stores/masters/mrm/meeting-agenda-store';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { MeetingAgendaService } from 'src/app/core/services/masters/mrm/meeting-agenda/meeting-agenda.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-meeting-agenda',
  templateUrl: './meeting-agenda.component.html',
  styleUrls: ['./meeting-agenda.component.scss']
})
export class MeetingAgendaComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  MeetingAgendaMasterStore = MeetingAgendaMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_meeting_agenda_message';

  meetingAgendaObject = {
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
 

  meetingAgendaSubscriptionEvent: any = null;
  popupControlMeetingAgendaEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _meetingAgendaService: MeetingAgendaService) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_meeting_agenda'});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'MEETING_AGENDA_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_MEETING_AGENDA', submenuItem: {type: 'new_modal'}},
        {activityName: 'EXPORT_MEETING_AGENDA', submenuItem: {type: 'export_to_excel'}},
        // {activityName: 'SHARE_MEETING_AGENDA', submenuItem: {type: 'share'}},
        {activityName: null, submenuItem: {type: 'close', path: 'mrm'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_MEETING_AGENDA')){
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
              case "export_to_excel":
                this._meetingAgendaService.exportToExcel();
                break;
                case "search":
                  MeetingAgendaMasterStore.searchText = SubMenuItemStore.searchText;
                  this.pageChange(1);
                   break;
                   case "share":
                    ShareItemStore.setTitle('share_meeting_agenda_title');
                    ShareItemStore.formErrors = {};
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
            this._meetingAgendaService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
          
            });
          }
        })

         // for deleting/activating/deactivating using delete modal
      this.popupControlMeetingAgendaEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })
      this.meetingAgendaSubscriptionEvent = this._eventEmitterService.meetingAgenda.subscribe(res => {
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
    this.meetingAgendaObject.type = 'Add';
    this.meetingAgendaObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) MeetingAgendaMasterStore.setCurrentPage(newPage);
    this._meetingAgendaService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.meetingAgendaObject.type = null;
  }

  activate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Meeting Agenda?';
    this.popupObject.subtitle = 'are_you_sure_activate';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Meeting Agenda?';
    this.popupObject.subtitle = 'are_you_sure_deactivate';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  
  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteMeetingAgenda(status)
      break;
      
      case 'Activate': this.activateMeetingAgenda(status)
        break;
  
      case 'Deactivate': this.deactivateMeetingAgenda(status)
        break;
  
    }
  
  }

  // delete function call
  deleteMeetingAgenda(status: boolean) {
    if (status && this.popupObject.id) {
      this._meetingAgendaService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405){
          let id = this.popupObject.id;
          this.closeConfirmationPopUp();
          this.clearPopupObject();
          setTimeout(() => {
            this.deactivate(id);
            this._utilityService.detectChanges(this._cdr);
          }, 500);
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

     // get perticuller meeting agenda
  getMeetingAgenda(id: number) {
    this._meetingAgendaService.getItem(id).subscribe(res=>{

          this.loadPopup();
          this._utilityService.detectChanges(this._cdr);
        
      })
   
  }
loadPopup()
{
  const meetingAgendaSingle: MeetingAgendaDetails = MeetingAgendaMasterStore.individualMeetingAgendaId;
  this.meetingAgendaObject.values = {
    id: meetingAgendaSingle.id,
    details: meetingAgendaSingle
  }
  this.meetingAgendaObject.type = 'Edit';
  this.openFormModal();
}

// for delete
delete(id: number) {
  // event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'Delete Meeting Agenda?';
  this.popupObject.subtitle = 'are_you_sure_delete';

  $(this.confirmationPopUp.nativeElement).modal('show');

}
  
  // calling activcate function
  
  activateMeetingAgenda(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._meetingAgendaService.activate(this.popupObject.id).subscribe(resp => {
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
  
  deactivateMeetingAgenda(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._meetingAgendaService.deactivate(this.popupObject.id).subscribe(resp => {
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
      //MeetingCategoryMasterStore.setCurrentPage(1);
      this._meetingAgendaService.sortMeetingAgendaList(type, null);
      this.pageChange();
    }
  
    ngOnDestroy() {
      // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.meetingAgendaSubscriptionEvent.unsubscribe();
      this.popupControlMeetingAgendaEventSubscription.unsubscribe();
      MeetingAgendaMasterStore.searchText = '';
      MeetingAgendaMasterStore.currentPage = 1 ;
      this.idleTimeoutSubscription.unsubscribe();
      this.networkFailureSubscription.unsubscribe();
    }
  
}
