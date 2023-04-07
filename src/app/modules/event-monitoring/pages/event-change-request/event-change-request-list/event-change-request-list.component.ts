import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventChangeRequestService } from "src/app/core/services/event-monitoring/event-change-request/event-change-request.service";
import { EventsService } from 'src/app/core/services/event-monitoring/events/events.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { EventChangeRequestStore } from 'src/app/stores/event-monitoring/events/event-change-request-store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { Subscription } from 'rxjs';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

declare var $: any;
@Component({
  selector: 'app-event-change-request-list',
  templateUrl: './event-change-request-list.component.html',
  styleUrls: ['./event-change-request-list.component.scss']
})
export class EventChangeRequestListComponent implements OnInit {

  @ViewChild('changeRequestModal', {static: true}) changeRequestModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  changeRequestObject = {
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
  reactionDisposer: IReactionDisposer;
  AppStore = AppStore;
  AuthStore = AuthStore;
  NoDataItemStore = NoDataItemStore;
  SubMenuItemStore = SubMenuItemStore;
  EventChangeRequestStore = EventChangeRequestStore;
  RightSidebarLayoutStore=RightSidebarLayoutStore;
  eventChangeReqSubscription: any;
  popupControlEventSubscription: any;
  filterSubscription: Subscription = null;
  constructor(private _eventChangeRequestService: EventChangeRequestService, private _eventsService: EventsService,
    private _helperService: HelperServiceService, private _utilityService: UtilityService, private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _cdr: ChangeDetectorRef, private _imageService:ImageServiceService, private _router: Router,) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;
    EventsStore.selectedEventId = null;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.EventChangeRequestStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    });
    NoDataItemStore.setNoDataItems({title:"common_nodata_title"});
    this.reactionDisposer = autorun(() => {  
      var subMenuItems = [
        {activityName: 'EVENT_CHANGE_REQUEST_LIST', submenuItem: {type: 'search'}},
        {activityName: 'EVENT_CHANGE_REQUEST_LIST', submenuItem: {type: 'refresh'}},
        { activityName: null, submenuItem: { type: 'export_to_excel' } },
      ]
      if(AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(4000,'CREATE_EVENT_CHANGE_REQUEST')){
        NoDataItemStore.deleteObject('subtitle');
      }
      this._helperService.checkSubMenuItemPermissions(4000, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.newChangeRequest();
            break;
          case "export_to_excel":
            this._eventChangeRequestService.exportToExcel();
            break;
          case "search":
            EventChangeRequestStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1); 
            break;
          case 'refresh':
            EventChangeRequestStore.loaded = false
            this.pageChange(1); 
            break
          default:
						break;
				}
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      } 
    });
    this.eventChangeReqSubscription = this._eventEmitterService.eventChangeReqModal.subscribe(item => {
      this.closeChangeRequestModal()
    });
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteChangeRequest(item);
    })
    this.pageChange(1);
    RightSidebarLayoutStore.filterPageTag = 'event_monitoring_event_change_request';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'event_change_request_status_ids',
      'event_ids'
    ]);
  }

  pageChange(newPage: number = null) {
    if (newPage) EventChangeRequestStore.setCurrentPage(newPage);
    this._eventChangeRequestService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  gotpChangeRequestDetails(id,eventId){
    EventChangeRequestStore.setMenuChoosedListingSubmenu();
    event.stopPropagation();
    EventChangeRequestStore.selectedCRId = id
    // this._eventChangeRequestService.getItem(id).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    this._router.navigateByUrl('event-monitoring/events/'+eventId+'/change-request/'+id);
  }

  newChangeRequest(){
    this.changeRequestObject.type = "Add";
    this.changeRequestObject.value = null;
    this.openNewRequestModal()
  }

  openNewRequestModal(){
    setTimeout(() => {
      $(this.changeRequestModal.nativeElement).modal('show');
    }, 100);
  }

  closeChangeRequestModal(){
    this.changeRequestObject.type = ''
    setTimeout(() => {
      $(this.changeRequestModal.nativeElement).modal('hide');
    }, 100);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }
    // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  sortTitle(type: string) {
    this._eventChangeRequestService.sortEventChangeReqList(type);
    this.pageChange();
  }

  getEventDetails(id){
    this._eventsService.getItem(id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  deleteConfirm(event,changeRequestItem){
    event.stopPropagation();
    this.popupObject.id = changeRequestItem.id;
    this.popupObject.type = '';
    this.popupObject.subtitle = 'delete_event_cr_subtitle';
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 100);
  }

  deleteChangeRequest(status){
    if(status && this.popupObject.id){
      this._eventChangeRequestService.delete(this.popupObject.id,EventChangeRequestStore.changeRequestById(this.popupObject.id).event_id).subscribe(res=>{
        // this.pageChange();
        this.clearPopUpObject();
        this.closeConfirmationPopUp();
      },(error)=>{
        this.closeConfirmationPopUp();
        this.clearPopUpObject();
      })
    }
    else{
      this.closeConfirmationPopUp();
      this.clearPopUpObject();
    }
  }

  clearPopUpObject(){
    this.popupObject.id = null;
  }

  closeConfirmationPopUp(){
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 100);
  }

  editChangeRequest(event,items){
    event.stopPropagation();
    this.getEventDetails(items.event_id)
    EventChangeRequestStore.selectedCRId = items.id;
    EventChangeRequestStore.setMenuChoosedListingSubmenu();
    EventsStore.selectedEventId = items.event_id;
    this._eventChangeRequestService.getIndividualItem(EventsStore.selectedEventId,items.id).subscribe(res=>{
      this.changeRequestObject.value = res
      this.changeRequestObject.type = 'Edit'
      this.openNewRequestModal()
      this._utilityService.detectChanges(this._cdr);
    })
  }

  ngOnDestroy(){
    SubMenuItemStore.makeEmpty();
    if (this.reactionDisposer) this.reactionDisposer();
    this.popupControlEventSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }

}
