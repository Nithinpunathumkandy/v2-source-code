import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventMilestoneService } from 'src/app/core/services/event-monitoring/event-milestone/event-milestone.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { EventMonitoringStore } from 'src/app/stores/event-monitoring/events/event-monitoring.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { EventMilestoneStore } from 'src/app/stores/event-monitoring/event-milestone-store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';

declare var $: any;

@Component({
  selector: 'app-event-milestone',
  templateUrl: './event-milestone.component.html',
  styleUrls: ['./event-milestone.component.scss']
})
export class EventMilestoneComponent implements OnInit {

  @ViewChild('newMilestone', {static: true}) newMilestone: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('newProgress', {static: true}) newProgress: ElementRef;


  EventMonitoringStore = EventMonitoringStore;
  EventMilestoneStore = EventMilestoneStore;
  EventsStore=EventsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuthStore = AuthStore
  reactionDisposer: IReactionDisposer;

  newMilestoneObject = {
    id : null,
    type : null,
    value : null
  }
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  newProgressObject = {
    id : null,
    type : null,
    value : null
  }
  eventMileStoneEventSubscrion: any;
  popupControlEventSubscription: any;
  eventProgressEventSubscrion: any;

  constructor(private _renderer2: Renderer2,
   private _helperService: HelperServiceService, 
   private _cdr: ChangeDetectorRef,  
   private _utilityService: UtilityService, 
   private _eventEmitterService: EventEmitterService,
   private _eventMilestoneService : EventMilestoneService) { }

  ngOnInit(): void {
    SubMenuItemStore.setNoUserTab(true);
    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {  

        var subMenuItems = [
         {activityName:null, submenuItem: {type: 'close', path: '../'}},
      ]
      if(!AuthStore.getActivityPermission(3700,'CREATE_EVENT_MILESTONE')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(3700, subMenuItems);
      if(EventsStore?.eventDetails?.event_status?.type=='draft' || EventsStore?.eventDetails?.event_status?.type=='send-back')
      {
        NoDataItemStore.setNoDataItems({title:"em_milestone_nodata_title", subtitle: 'em_milestone_nodata_subtitle',buttonText: 'em_new_milestone'});
      }
      else
      {
        NoDataItemStore.setNoDataItems({title:"em_milestone_nodata_title", subtitle: 'em_milestone_nodata_subtitle'});
      }
      
      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      } 
      if(NoDataItemStore.clikedNoDataItem){
         this.openNewEventModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });
    this.eventMileStoneEventSubscrion = this._eventEmitterService.eventMilestoneModal.subscribe(item => {
      this.closeNewMilestone()
      this.pageChange(1)
    })
    this.eventProgressEventSubscrion = this._eventEmitterService.eventProgressModal.subscribe(item => {
      this.closeNewProgress()
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.pageChange(1)
  }

  pageChange(newPage:number = null){
    if (newPage) EventMilestoneStore.setCurrentPage(newPage);
    this._eventMilestoneService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  isEven(num){
    if(num % 2 == 0){
      return true

    }else {
      return false
    }
  }

  openNewEventModal(){
  this.newMilestoneObject.type =  "Add"
  this.openNewMilestone();
  }

  
  openNewMilestone(){
    setTimeout(() => {
      $(this.newMilestone.nativeElement).modal('show');
    }, 100);
    this._renderer2.setStyle(this.newMilestone.nativeElement,'display','block');
    this._renderer2.setStyle(this.newMilestone.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.newMilestone.nativeElement,'z-index',99999);
  }

  closeNewMilestone(){
 
    setTimeout(() => {
      this.newMilestoneObject.type = null;
      this.newMilestoneObject.value = null;
      $(this.newMilestone.nativeElement).modal('hide');
      this._renderer2.removeClass(this.newMilestone.nativeElement,'show');
      this._renderer2.setStyle(this.newMilestone.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

 
  editMileStone(data){
      this._eventMilestoneService.getInduvalMilestons(data.id).subscribe(res=>{
      this.newMilestoneObject.type =  "Edit";
      this.newMilestoneObject.value = res;
      this.openNewMilestone()
      this._utilityService.detectChanges(this._cdr);
      })

  }

  // for delete
      delete(id: number) {
      event.stopPropagation();
      this.popupObject.type = 'are_you_sure';
      this.popupObject.id = id;
      this.popupObject.title = 'are_you_sure';
      this.popupObject.subtitle = 'delete_em_milestone_subtitle';
      this._utilityService.detectChanges(this._cdr);
      $(this.confirmationPopUp.nativeElement).modal('show');
      
     }
  
  // for popup object clearing
      clearPopupObject() {
      this.popupObject.id = null;
    }
  
  // modal control event
      modalControl(status: boolean) {
      switch (this.popupObject.type) {
      case 'are_you_sure': this.deleteMilestone(status)
        break;
      }

    }

    mileStonCompletion(data){
      return Number(data);
    }
  
 // delete function call
    deleteMilestone(status: boolean) {
        if (status && this.popupObject.id) {
          this._eventMilestoneService.deleteMileston(this.popupObject.id).subscribe(resp => {
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
            }, 500);
            this.pageChange(1)
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

  // milestone progress
    addNewMilestoneProgress(data){
      this._eventMilestoneService.getInduvalMilestons(data.id).subscribe(res=>{
      this.newProgressObject.type = 'Edit';
      this.newProgressObject.value = res;
      this.openNewProgress(); 
      this._utilityService.detectChanges(this._cdr); 
      })  
  }

    openNewProgress(){
      this._renderer2.addClass(this.newProgress.nativeElement,'show');
      this._renderer2.setStyle(this.newProgress.nativeElement,'display','block');
      this._renderer2.setStyle(this.newProgress.nativeElement,'overflow','auto');
      this._renderer2.setStyle(this.newProgress.nativeElement,'z-index',99999);
    }

    closeNewProgress(){
   
      setTimeout(() => {
        this.newProgressObject.type = null;
        this.newProgressObject.value = null;
        this._renderer2.removeClass(this.newProgress.nativeElement,'show');
        this._renderer2.setStyle(this.newProgress.nativeElement,'display','none');
        $('.modal-backdrop').remove();
        this._utilityService.detectChanges(this._cdr);
      }, 200);
    }

      ngOnDestroy(){
        if (this.reactionDisposer) this.reactionDisposer();
        SubMenuItemStore.makeEmpty();
        this.eventMileStoneEventSubscrion.unsubscribe();
        this.popupControlEventSubscription.unsubscribe();
        this.eventProgressEventSubscrion.unsubscribe();
      }
}
