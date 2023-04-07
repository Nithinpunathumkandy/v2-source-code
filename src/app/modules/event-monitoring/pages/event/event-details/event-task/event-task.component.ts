import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { EventTaskStore } from 'src/app/stores/event-monitoring/events/event-task.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventTaskService } from 'src/app/core/services/event-monitoring/events/event-task/event-task.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { TaskPhaseService } from 'src/app/core/services/masters/event-monitoring/task-phase/task-phase.service';
import { TaskPhaseMasterStore } from 'src/app/stores/masters/event-monitoring/task-phase-store';

declare var $: any;

@Component({
  selector: 'app-event-task',
  templateUrl: './event-task.component.html',
  styleUrls: ['./event-task.component.scss']
})
export class EventTaskComponent implements OnInit, OnDestroy {

  @ViewChild('deleteModal', { static: true }) deleteModal: ElementRef;
  @ViewChild('taskFormModal', { static: true }) taskFormModal: ElementRef;

  reactionDisposer: IReactionDisposer;

  AppStore = AppStore
  EventsStore = EventsStore
  EventTaskStore = EventTaskStore
  TaskPhaseMasterStore = TaskPhaseMasterStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore

  eventTaskSubscription: Subscription
  popupControlEventSubscription: Subscription

  taskObject = {
    id: null,
    type: null,
    value: null,
    values: null
  };

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  constructor(
    private _router: Router,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _eventTaskService: EventTaskService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _taskPhaseService:TaskPhaseService,
  ) { }

  ngOnInit(): void {
    
    this.reactionDisposer = autorun(() => {
      var subMenuItems=[];
      if(EventsStore?.eventDetails?.event_status?.type=='draft' || EventsStore?.eventDetails?.event_status?.type=='send-back')
      {
        subMenuItems.push({activityName: null, submenuItem: {type: 'new_modal'}})
      }
      subMenuItems.push({activityName:null, submenuItem: {type: 'close', path: '../'}})
      // var subMenuItems = [
      //   { activityName: null, submenuItem: { type: 'new_modal' } },
      //   { activityName: null, submenuItem: { type: 'close', path: '../' } },
      // ];

      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
      setTimeout(() => {
        if(EventsStore?.eventDetails?.event_status?.type=='draft' || EventsStore?.eventDetails?.event_status?.type=='send-back')
        {
          NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_task' });
        }
        else
        {
          NoDataItemStore.setNoDataItems({ title: "common_nodata_title"});
        }
       
      }, 300);
      if (SubMenuItemStore.clikedSubMenuItem) {
        //submenu selection
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.openNewTask();
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if (NoDataItemStore.clikedNoDataItem) {
        this.openNewTask()
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });

    // for deleting using delete modal
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteEventTask(item);
    })

    this.eventTaskSubscription = this._eventEmitterService.eventTaskModal.subscribe(item => {
      this.closeFormModal();
    })
    this.getTaskPhase()
    this.setTaskPhase('initiation',1)

    //1 is for initiation and function for getting details of the list
    //this.getDetails(1)
  }

  setClass(dataId) {    
    if (EventTaskStore.taskPhaseId == dataId) {
      EventTaskStore.taskPhaseId == null
    }
    else
      EventTaskStore.taskPhaseId = dataId
    this._utilityService.detectChanges(this._cdr)
  }

  getTaskPhase(newPage: number = null) {
    if (newPage) TaskPhaseMasterStore.setCurrentPage(newPage);
    this._taskPhaseService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getDetails(id,newPage:number=null) {
    if (newPage) EventTaskStore.setCurrentPage(newPage);
    EventTaskStore.unsetEventsList()
    this._eventTaskService.getItems(`&task_phase_id=${id}`).subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    })
  }

  //setting task phase id and type when opening form
  setTaskPhase(type, id) {
    EventTaskStore.taskPhaseType = type
    EventTaskStore.taskPhaseId = id
    this.getDetails(id,1)
  }

  //this is for opening add task  
  openNewTask() {
    this.taskObject.type = 'Add';
    this.taskObject.value = EventTaskStore.taskPhaseType;
    this.taskObject.id = EventTaskStore.taskPhaseId;
    this._utilityService.detectChanges(this._cdr);
    this.openNewTaskFormModal();
  }

  //it will open add task modal
  openNewTaskFormModal() {
    setTimeout(() => {
      $(this.taskFormModal.nativeElement).modal('show');
    }, 100);
  }

  //it will close add/edit task modal
  closeFormModal() {
    $(this.taskFormModal.nativeElement).modal('hide');
    this.taskObject.type = null;
  }

  //editing task setting all the valuse and opening form
  edit(event, id) {
    event.stopPropagation();
    this._utilityService.detectChanges(this._cdr);
    this._eventTaskService.getTaskDetails(id).subscribe(res => {
      if (res) {
        this.taskObject.values = {
          id: res.id,
          title: res.title,
          description: res.description,
          duration: res.duration,
          percentage: res.percentage,
          responsible_users: res.responsible_users,
          start_date: res.start_date,
          end_date: res.end_date,
          documents:res.documents
        }
        this.taskObject.type = 'Edit';
        this.taskObject.value = EventTaskStore.taskPhaseType;
        this.taskObject.id = EventTaskStore.taskPhaseId;
        this.openNewTaskFormModal();
      }     
      this._utilityService.detectChanges(this._cdr);
    })
  }

  //it'll navigate to details of the page
  gotoDetails(id) {
    this._router.navigateByUrl(`event-monitoring/events/${EventsStore.selectedEventId}/task/${id}`)
  }

  //setting necessary data and opening the delete popup
  delete(event, id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Event Task?';
    this.popupObject.subtitle = 'event_task_delete_subtitle';
    $(this.deleteModal.nativeElement).modal('show');
  }

  //here we're deleting the particular task
  deleteEventTask(status: boolean) {
    if (status && this.popupObject.id) {
      this._eventTaskService.delete(this.popupObject.id,EventTaskStore.taskPhaseType).subscribe(resp => {
        if (resp) {
          this.getDetails(EventTaskStore.taskPhaseId)
        }
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
      $(this.deleteModal.nativeElement).modal('hide');
    }, 250);
  }

  //need to clear the object when we're closing the delete popup
  clearPopupObject() {
    this.popupObject.id = null;
  }

  //Don't forget to dispose the reaction disposer and event emitter
  ngOnDestroy(): void {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    EventTaskStore.unsetEventsList()
    EventTaskStore.taskPhaseType=""
    EventTaskStore.taskPhaseId=null
    this.eventTaskSubscription.unsubscribe()
    this.popupControlEventSubscription.unsubscribe()
  }

}
