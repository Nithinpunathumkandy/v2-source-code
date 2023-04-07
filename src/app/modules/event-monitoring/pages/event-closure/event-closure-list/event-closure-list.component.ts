import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { indivitualEventClosure } from 'src/app/core/models/event-monitoring/event-closure';
import { EventClosureEventDetailsService } from 'src/app/core/services/event-monitoring/event-closure-event-details/event-closure-event-details.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { EventClosureMainStore } from 'src/app/stores/event-monitoring/event-closure-main-store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { Subscription } from 'rxjs';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
declare var $: any;

@Component({
  selector: 'app-event-closure-list',
  templateUrl: './event-closure-list.component.html',
  styleUrls: ['./event-closure-list.component.scss']
})
export class EventClosureListComponent implements OnInit,OnDestroy {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('formModal', {static: true}) formModal: ElementRef;
  reactionDisposer: IReactionDisposer;
  EventClosureMainStore = EventClosureMainStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  EventsStore=EventsStore;
  RightSidebarLayoutStore=RightSidebarLayoutStore;
 
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  eventClosureObject = {
    id : null,
    type : null,
    value : null
  }

  popupControlEventSubscription: any;
  closureSubscriptionEvent: any = null;
  filterSubscription: Subscription = null;
  constructor(
    private _eventClosureEventDetailsService: EventClosureEventDetailsService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _router:Router
  ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.EventClosureMainStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    });
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_closure'});
    this.reactionDisposer = autorun(() => {  
      var subMenuItems =this.getSubmenu()
     if(!AuthStore.getActivityPermission(3200,'EVENT_CLOSURE_CHECKLIST_LIST')){
      NoDataItemStore.deleteObject('subtitle');
      NoDataItemStore.deleteObject('buttonText');
    }
     this._helperService.checkSubMenuItemPermissions(3700, subMenuItems);

     if (SubMenuItemStore.clikedSubMenuItem) {
      switch (SubMenuItemStore.clikedSubMenuItem.type) {
        case "new_modal":
          this.openNewEventClosureModal();
          break;
        case "export_to_excel":
          this._eventClosureEventDetailsService.exportToExcel();
          break;
        case "search":
          EventClosureMainStore.searchText = SubMenuItemStore.searchText;
           this.pageChange(1); 
           break;
           case "refresh":
            SubMenuItemStore.searchText = '';
            EventClosureMainStore.searchText = '';
            EventClosureMainStore.loaded = false;
            this.pageChange(1);
            break;	  
        default:
          break;
      }
      // Don't forget to unset clicked item immediately after using it
      SubMenuItemStore.unSetClickedSubMenuItem();
    } 

      if(NoDataItemStore.clikedNoDataItem){
        this.openNewEventClosureModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.closureSubscriptionEvent = this._eventEmitterService.eventClosureMainModal.subscribe(item => {
      this.closeEventClosure()
      this.pageChange()
    })

    this.pageChange(1);
    RightSidebarLayoutStore.filterPageTag = 'event_monitoring_event_closure';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'event_closure_status_ids',
      'event_ids'
    ]);
  }

  getSubmenu(){ 
    var subMenuItems=[{activityName: 'EVENT_CLOSURE_CHECKLIST_LIST', submenuItem: {type: 'search'}},
    {activityName: 'EVENT_CLOSURE_CHECKLIST_LIST', submenuItem: {type: 'refresh'}},
    {activityName: 'CREATE_EVENT_CLOSURE_CHECKLIST', submenuItem: {type: 'new_modal'}},
    { activityName: 'EXPORT_EVENT_CLOSURE_CHECKLIST', submenuItem: { type: 'export_to_excel' } },
    {activityName:null, submenuItem: {type: 'close', path: '../'}}
    ];

  //  if(EventClosureStore.allItems.length ==0){
  //     subMenuItems.push({activityName: 'CREATE_EVENT_CLOSURE_CHECKLIST', submenuItem: {type: 'new_modal'}})
  //  }
  
   return subMenuItems
  }
  gotoDetails(id,eventId){
    EventsStore.selectedEventId=eventId;
    EventClosureMainStore.setRouteMainListing();
    this._router.navigateByUrl(`event-monitoring/event-closures/${id}`)
  }

  pageChange(newPage:number = null){
    if (newPage) EventClosureMainStore.setCurrentPage(newPage);
    this._eventClosureEventDetailsService.getClosureItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

   //modal control event
   modalControl(status: boolean) {
    switch (this.popupObject.title) {
      case 'delete_event_closure': this.deleteEventClosure(status)
        break;
    }

  }

   // for delete
delete(id: number,eventId,event) {
  event.stopPropagation();
  EventsStore.selectedEventId=eventId;
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'delete_event_closure';
  this.popupObject.subtitle = 'event_closure_delete_message';
  this._utilityService.detectChanges(this._cdr);
  $(this.confirmationPopUp.nativeElement).modal('show');

}

//for popup object clearing
clearPopupObject() {
    this.popupObject.id = null;
}


// delete function call
deleteEventClosure(status: boolean) {
  if (status && this.popupObject.id) {
    this._eventClosureEventDetailsService.deleteEventClosureListing(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.pageChange()
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
  this._eventClosureEventDetailsService.sortList(type, null);
  this.pageChange();
}

getEventClosure(id: number,eventId:number,event)  {
  event.stopPropagation();
  EventsStore.selectedEventId=eventId;
  this._eventClosureEventDetailsService.getItem(id).subscribe(res=>{
    this.edit();
    })
    this._utilityService.detectChanges(this._cdr);
}
openNewEventClosureModal(){
  this.eventClosureObject.type = 'Add FromSubMenu';
  this.eventClosureObject.value = null; // for clearing the value
  this.eventClosureObject.id = null;
  this.openModal();
}
edit()
{  
  const singleEventClosure: indivitualEventClosure = EventClosureMainStore.indivitualEventClosure;   
  this.eventClosureObject.value = {
    
    id: singleEventClosure.id,
    title: singleEventClosure.title,
    actual_event_completion_date: singleEventClosure.actual_event_completion_date,
    planned_event_completion:singleEventClosure.event.end_date,
    comments:singleEventClosure.comments,
    scope_of_works:singleEventClosure.scope_of_works,
    event_summary:singleEventClosure.event_summary,
    event_details:singleEventClosure.event

  }
  this.eventClosureObject.type = 'Edit FromSubMenu';
  this._utilityService.detectChanges(this._cdr);
  this.openModal();
}

closeEventClosure(){

  setTimeout(() => {
    this.eventClosureObject.type = null;
    this.eventClosureObject.value = null;
    $(this.formModal.nativeElement).modal('hide');
    this._renderer2.removeClass(this.formModal.nativeElement,'show');
    this._renderer2.setStyle(this.formModal.nativeElement,'display','none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }, 200);
}

openModal(){
  setTimeout(() => {
    $(this.formModal?.nativeElement).modal('show');
  }, 100);
  // this._renderer2.addClass(this.formModal.nativeElement,'show');
  this._renderer2.setStyle(this.formModal?.nativeElement,'display','block');
  this._renderer2.setStyle(this.formModal?.nativeElement,'overflow','auto');
  this._renderer2.setStyle(this.formModal?.nativeElement,'z-index',99999);
}

ngOnDestroy(){
  if (this.reactionDisposer) this.reactionDisposer();
  SubMenuItemStore.makeEmpty();
  SubMenuItemStore.searchText="";
  EventClosureMainStore.unsetEventClosure();
  this.popupControlEventSubscription.unsubscribe();
  this.closureSubscriptionEvent.unsubscribe();
  this._rightSidebarFilterService.resetFilter();
  this.filterSubscription.unsubscribe();
  RightSidebarLayoutStore.showFilter = false;
}
}
