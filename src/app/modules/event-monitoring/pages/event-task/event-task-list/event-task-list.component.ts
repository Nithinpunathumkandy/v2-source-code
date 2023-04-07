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
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { EventTaskDetails } from 'src/app/core/models/event-monitoring/events/event-task';
import { AuthStore } from 'src/app/stores/auth.store';
import { EventDashboardStore } from 'src/app/stores/event-monitoring/dashboard/dashboard-store';
declare var $: any;
@Component({
  selector: 'app-event-task-list',
  templateUrl: './event-task-list.component.html',
  styleUrls: ['./event-task-list.component.scss']
})
export class EventTaskListComponent implements OnInit,OnDestroy {
  @ViewChild('deleteModal', { static: true }) deleteModal: ElementRef;
  @ViewChild('taskFormModal', { static: true }) taskFormModal: ElementRef;
  reactionDisposer: IReactionDisposer;
  AppStore = AppStore;
  AuthStore=AuthStore;
  EventsStore = EventsStore
  EventTaskStore = EventTaskStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  RightSidebarLayoutStore=RightSidebarLayoutStore;
  popupControlEventSubscription: Subscription;
  closureSubscriptionEvent: any = null;
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  taskObject = {
    id: null,
    type: null,
    value: null,
    values: null
  };
  filterSubscription: Subscription = null;
  constructor(
    private _router: Router,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _eventTaskService: EventTaskService,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService,
  ) { 
   
  }

  ngOnInit(): void {
    RightSidebarLayoutStore.filterPageTag = 'event_monitoring_event_tasks';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'event_task_status_ids',
      'task_phase_ids'
    ]);
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.EventTaskStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    });
    this.reactionDisposer = autorun(() => {
      var subMenuItems=[{activityName: 'EVENT_TASK_LIST', submenuItem: {type: 'search'}},
      {activityName: 'EVENT_TASK_LIST', submenuItem: {type: 'refresh'}},
      {activityName: 'CREATE_EVENT_TASK', submenuItem: {type: 'new_modal'}},
      { activityName: null, submenuItem: { type: 'export_to_excel' } },
      {activityName:null, submenuItem: {type: 'close', path: '../'}}];
      
      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
      setTimeout(() => {
          NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_event_task'});
        
      }, 300);
      if(NoDataItemStore.clikedNoDataItem){
        this.openNewTask();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if (SubMenuItemStore.clikedSubMenuItem) {
        //submenu selection
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "search":
            EventTaskStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1); 
            break;
          case "refresh":
            SubMenuItemStore.searchText = '';
            EventTaskStore.searchText = '';
            EventTaskStore.loaded = false;
            this.pageChange(1);
            break;
          case "new_modal":
            this.openNewTask();
            break;
          case "export_to_excel":
          this._eventTaskService.exportToExcel();
          break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

    });
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.closureSubscriptionEvent = this._eventEmitterService.eventTaskModal.subscribe(item => {
      this.closeEventClosure()
      //this.pageChange()
    })

    this.pageChange(1);
   
  }

  closeEventClosure(){

    setTimeout(() => {
      this.taskObject.type = null;
      this.taskObject.value = null;
      $(this.taskFormModal.nativeElement).modal('hide');
      this._renderer2.removeClass(this.taskFormModal.nativeElement,'show');
      this._renderer2.setStyle(this.taskFormModal.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  pageChange(newPage:number=null) {
    if (newPage) EventTaskStore.setCurrentPage(newPage);
    var additionalParams=''
    if (EventDashboardStore.dashboardParameter) {
      additionalParams = EventDashboardStore.dashboardParameter
    }
    this._eventTaskService.getItemsTaskList(additionalParams ? additionalParams : '').subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  modalControl(status: boolean) {
    switch (this.popupObject.title) {
      case 'delete_event_task': this.deleteEventTask(status)
        break;
    }

  }

   //it'll navigate to details of the page
   gotoDetails(id,eventId) {
    EventsStore.selectedEventId=eventId;
    EventTaskStore.setRouteMainListing();
    this._router.navigateByUrl(`event-monitoring/events/${EventsStore.selectedEventId}/task/${id}`)
  }

  //setting necessary data and opening the delete popup
  delete(event, id: number,eventId) {
    event.stopPropagation();
    EventsStore.selectedEventId=eventId;
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'delete_event_task';
    this.popupObject.subtitle = 'event_task_delete_subtitle';
    $(this.deleteModal.nativeElement).modal('show');
  }

  //here we're deleting the particular task
  deleteEventTask(status: boolean) {
    if (status && this.popupObject.id) {
      this._eventTaskService.deleteTaskListing(this.popupObject.id).subscribe(resp => {
        if (resp) {
          this.pageChange()
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

  sortTitle(type: string) {
    this._eventTaskService.sortList(type, null);
    this.pageChange();
  }

  openNewTask() {
    this.taskObject.type = 'add_submenu';
    //this.taskObject.value = EventTaskStore.taskPhaseType;
    //this.taskObject.id = EventTaskStore.taskPhaseId;
    this._utilityService.detectChanges(this._cdr);
    this.openNewTaskFormModal();
  }

  openNewTaskFormModal() {
    setTimeout(() => {
      $(this.taskFormModal.nativeElement).modal('show');
    }, 100);
    this._renderer2.setStyle(this.taskFormModal?.nativeElement,'display','block');
    this._renderer2.setStyle(this.taskFormModal?.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.taskFormModal?.nativeElement,'z-index',99999);
  }

  getEventClosure(id: number,eventId:number,event)  {
    event.stopPropagation();
    EventsStore.selectedEventId=eventId;
    this._eventTaskService.getTaskDetails(id).subscribe(res=>{
      this.edit();
      })
      this._utilityService.detectChanges(this._cdr);
  }

  // edit() {
  //   event.stopPropagation();
  //   this._utilityService.detectChanges(this._cdr);
  //   this._eventTaskService.getTaskDetails(id).subscribe(res => {
  //     if (res) {
  //       this.taskObject.values = {
  //         id: res.id,
  //         title: res.title,
  //         description: res.description,
  //         duration: res.duration,
  //         percentage: res.percentage,
  //         responsible_users: res.responsible_users,
  //         start_date: res.start_date,
  //         end_date: res.end_date
  //       }
  //       this.taskObject.type = 'Edit';
  //       this.taskObject.value = EventTaskStore.taskPhaseType;
  //       this.taskObject.id = EventTaskStore.taskPhaseId;
  //       this.openNewTaskFormModal();
  //     }
  //     this._utilityService.detectChanges(this._cdr);
  //   })
  // }

  edit()
{  
  const eventTask: EventTaskDetails = EventTaskStore.IndividualEventTaskDetails;   
  this.taskObject.values = {
    
    id: eventTask.id,
    reference_code: eventTask.reference_code,
    task_phase_title:eventTask.task_phase_title,
    title: eventTask.title,
    responsible_users: eventTask.responsible_users,
    start_date: eventTask.start_date,
    end_date: eventTask.end_date,
    duration: eventTask.duration,
    percentage: eventTask.percentage,
    event_task_id: eventTask.event_task_id,
    description: eventTask.description,
    documents:eventTask.documents
  }
  this.taskObject.id = EventTaskStore.taskPhaseId;
  this.taskObject.type = 'edit_submenu';
  this._utilityService.detectChanges(this._cdr);
  this.openNewTaskFormModal();
}

  //Don't forget to dispose the reaction disposer and event emitter
  ngOnDestroy(): void {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    EventTaskStore.searchText="";
    EventTaskStore.unsetEventsList()
    this.popupControlEventSubscription.unsubscribe();
    this.closureSubscriptionEvent.unsubscribe()
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    //RightSidebarLayoutStore.disableSidebarFilter();
  }

}
