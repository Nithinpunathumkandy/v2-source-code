import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { Router } from "@angular/router";
import { EventsService } from 'src/app/core/services/event-monitoring/events/events.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from 'src/app/stores/app.store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { Subscription } from 'rxjs';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { EventDashboardStore } from 'src/app/stores/event-monitoring/dashboard/dashboard-store';

declare var $: any;
@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;

  SubMenuItemStore = SubMenuItemStore;
  EventsStore = EventsStore;
  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  RightSidebarLayoutStore=RightSidebarLayoutStore;

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  deleteEventSubscription: any;
  filterSubscription: Subscription = null;

  constructor(private _eventService: EventsService,private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _helperService: HelperServiceService,private _imageService:ImageServiceService,
    private _eventEmitterService: EventEmitterService, private _renderer2: Renderer2, private _rightSidebarFilterService: RightSidebarFilterService,
    private _router: Router) { 
   
    }

  ngOnInit(): void {
    RightSidebarLayoutStore.filterPageTag = 'event_monitoring';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'event_location_ids',
      'event_type_ids',
      'event_priority_ids',
      'event_status_ids',
      'event_periodicity_ids',
      'event_entrance_ids',
      'event_target_audience_ids',
      'event_entrance_ids',
      'event_dimension_ids',
      'event_space_type_ids',
      'event_range_ids',
      'owner_ids'

    ]);
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.EventsStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    });
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_event'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'EVENT_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EVENT_LIST', submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_EVENT', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_EVENT_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_EVENT', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'import'}},
      ]
      if(AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(100,'CREATE_EVENT')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.createEvent();
            break;
          case "template":
            this._eventService.generateTemplate();
            break;
          case "export_to_excel":
            this._eventService.exportToExcel();
            break;
          case "search":
            EventsStore.searchText  = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "refresh":
            EventsStore.unsetEventsList();
            this.pageChange(1)
            break;
            case "import":
              ImportItemStore.setTitle('import_event');
              ImportItemStore.setImportFlag(true);
              break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        this.createEvent();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if(ImportItemStore.importClicked){
        ImportItemStore.importClicked = false;
        this._eventService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
          ImportItemStore.unsetFileDetails();
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

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteEvent(item);
    })
    //console.log(EventsStore.currentPage)
    if(EventsStore.currentPage)
    {
      this.pageChange(EventsStore.currentPage);
    }
    else
    {
      this.pageChange(1);
    }
    
  }

  pageChange(newPage: number = null) {
    if (newPage) EventsStore.setCurrentPage(newPage);
    var additionalParams=''
    if (EventDashboardStore.dashboardParameter) {
      additionalParams = EventDashboardStore.dashboardParameter
    }
    this._eventService.getItems(additionalParams ? additionalParams : '').subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  deleteEvent(status){
    if (status && this.popupObject.id) {
      this._eventService.delete(this.popupObject.id).subscribe(resp => {
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

  clearPopupObject(){
    this.popupObject.id = null;
  }

  createEvent(){
    this._router.navigateByUrl('/event-monitoring/events/new');
  }

  editEvent(id: number){
    event.stopPropagation();
    EventsStore.selectedEventId = id;
    this._router.navigateByUrl(`/event-monitoring/events/edit`);
  }

  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.subtitle = 'delete_event';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  gotoEventDetails(id: number){
    // EventsStore.eventId = id;
    // this._eventService.getItem(id).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    // this._eventService.getOutcome(id).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    this._router.navigateByUrl(`/event-monitoring/events/${id}`)
  }

  sortTitle(type: string) {
    this._eventService.sorteventsList(type);
    this.pageChange();
  }

   //passing token to get preview
   createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  //returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    EventsStore.searchText = '';
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    //RightSidebarLayoutStore.disableSidebarFilter();
  }

}
