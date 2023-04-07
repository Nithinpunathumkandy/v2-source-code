import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy, Renderer2 } from '@angular/core';
import { MeetingObjective } from 'src/app/core/models/masters/mrm/meeting-objective';
import{MeetingObjectiveMasterStore} from 'src/app/stores/masters/mrm/meeting-objective-store';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { MeetingObjectiveService } from 'src/app/core/services/masters/mrm/meeting-objective/meeting-objective.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
declare var $: any;


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-meeting-objective',
  templateUrl: './meeting-objective.component.html',
  styleUrls: ['./meeting-objective.component.scss']
})
export class MeetingObjectiveComponent implements OnInit, OnDestroy  {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  MeetingObjectiveMasterStore = MeetingObjectiveMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_meeting_objective_message';

  meetingObjectiveObject = {
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
 
  meetingObjectiveSubscriptionEvent: any = null;
  popupControlMeetingObjectiveEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _meetingObjectiveService: MeetingObjectiveService) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_meeting_objective'});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'MEETING_OBJECTIVE_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_MEETING_OBJECTIVE', submenuItem: {type: 'new_modal'}},
        {activityName: 'EXPORT_MEETING_OBJECTIVE', submenuItem: {type: 'export_to_excel'}},
        // {activityName: 'SHARE_MEETING_OBJECTIVE', submenuItem: {type: 'share'}},
        {activityName: null, submenuItem: {type: 'close', path: 'mrm'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_MEETING_OBJECTIVE')){
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
                this._meetingObjectiveService.exportToExcel();
                break;
                case "search":
                  MeetingObjectiveMasterStore.searchText = SubMenuItemStore.searchText;
                  this.pageChange(1);
                   break;
                   case "share":
                    ShareItemStore.setTitle('share_meeting_objective_title');
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
            this._meetingObjectiveService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
      this.popupControlMeetingObjectiveEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })
      this.meetingObjectiveSubscriptionEvent = this._eventEmitterService.meetingObjective.subscribe(res => {
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
    this.meetingObjectiveObject.type = 'Add';
    this.meetingObjectiveObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) MeetingObjectiveMasterStore.setCurrentPage(newPage);
    this._meetingObjectiveService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.meetingObjectiveObject.type = null;
  }

  activate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Meeting Objective?';
    this.popupObject.subtitle = 'are_you_sure_activate';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Meeting Objective?';
    this.popupObject.subtitle = 'are_you_sure_deactivate';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  
  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteMeetingObjective(status)
      break;
      
      case 'Activate': this.activateMeetingObjective(status)
        break;
  
      case 'Deactivate': this.deactivateMeetingObjective(status)
        break;
  
    }
  
  }

  
  // delete function call
  deleteMeetingObjective(status: boolean) {
    if (status && this.popupObject.id) {
      this._meetingObjectiveService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && MeetingObjectiveMasterStore.getMeetingObjectiveById(this.popupObject.id).status_id == AppStore.activeStatusId){
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

    // get perticuller meeting objective
  getMeetingObjective(id: number) {
    this._meetingObjectiveService.getItem(id).subscribe(res=>{

          this.loadPopup();
          this._utilityService.detectChanges(this._cdr);
        
      })
   
  }
loadPopup()
{
  const meetingObjectiveSingle: MeetingObjective = MeetingObjectiveMasterStore.individualMeetingObjectiveId;
        
        this.meetingObjectiveObject.values = {
          id: meetingObjectiveSingle.id,
          title: meetingObjectiveSingle.title,
          description: meetingObjectiveSingle.description,
          
        }
        this.meetingObjectiveObject.type = 'Edit';
        this.openFormModal();
}

// for delete
delete(id: number) {
  // event.stopPropagation();
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'Delete Meeting Objective?';
  this.popupObject.subtitle = 'are_you_sure_delete';

  $(this.confirmationPopUp.nativeElement).modal('show');

}
  
  // calling activcate function
  
  activateMeetingObjective(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._meetingObjectiveService.activate(this.popupObject.id).subscribe(resp => {
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
  
  deactivateMeetingObjective(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._meetingObjectiveService.deactivate(this.popupObject.id).subscribe(resp => {
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
      this._meetingObjectiveService.sortMeetingObjectiveList(type, null);
      this.pageChange();
    }
  
    ngOnDestroy() {
      // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.meetingObjectiveSubscriptionEvent.unsubscribe();
      this.popupControlMeetingObjectiveEventSubscription.unsubscribe();
      MeetingObjectiveMasterStore.searchText = '';
      MeetingObjectiveMasterStore.currentPage = 1 ;
      this.idleTimeoutSubscription.unsubscribe();
      this.networkFailureSubscription.unsubscribe();
  }


}
