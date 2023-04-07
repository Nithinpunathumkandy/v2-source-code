import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { Router } from "@angular/router";
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

declare var $: any;
@Component({
  selector: 'app-event-change-request',
  templateUrl: './event-change-request.component.html',
  styleUrls: ['./event-change-request.component.scss']
})
export class EventChangeRequestComponent implements OnInit {
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
  eventChangeReqSubscription: any;
  popupControlEventSubscription: any;
  constructor(private _eventChangeRequestService: EventChangeRequestService, private _eventsService: EventsService,
    private _helperService: HelperServiceService, private _utilityService: UtilityService, private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef, private _imageService:ImageServiceService, private _router: Router) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title:"common_nodata_title", subtitle: 'common_nodata_subtitle',buttonText: 'New Change Request'});
    this.reactionDisposer = autorun(() => {  
      if(EventChangeRequestStore.allItems.length != 0){
        var subMenuItems = [
          {activityName: 'EVENT_CHANGE_REQUEST_LIST', submenuItem: {type: 'search'}},
          {activityName: 'EVENT_CHANGE_REQUEST_LIST', submenuItem: {type: 'refresh'}},
          {activityName: 'CREATE_EVENT_CHANGE_REQUEST', submenuItem: {type: 'new_modal'}},
          {activityName: null, submenuItem: { type: 'close', path: '../' } },
        ]
      }
      else {
        var subMenuItems = [         
          {activityName: 'CREATE_EVENT_CHANGE_REQUEST', submenuItem: {type: 'new_modal'}},
          {activityName: null, submenuItem: { type: 'close', path: '../' } },
        ]

      }
      
      if(AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(4000,'CREATE_EVENT_CHANGE_REQUEST')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(4000, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.newChangeRequest();
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
      if(NoDataItemStore.clikedNoDataItem){
        this.newChangeRequest();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });
    this.eventChangeReqSubscription = this._eventEmitterService.eventChangeReqModal.subscribe(item => {
       this.closeChangeRequestModal()
    });
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteChangeRequest(item);
    })
    this.pageChange(1);
  }

  pageChange(newPage?: number){
    if (newPage) EventChangeRequestStore.setCurrentPage(newPage);
    this._eventChangeRequestService.getEventChangeRequestItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr); 
    })
  }

  newChangeRequest(){
    if(EventChangeRequestStore.allItems.length == 0){
      this.changeRequestObject.type = "Add";
      this.changeRequestObject.value = null;
      this.openNewRequestModal();
    }
    else{
      let pos = EventChangeRequestStore.allItems.findIndex(e => e.type == 'draft');
      if(pos == -1){
        this.changeRequestObject.type = "Add";
        this.changeRequestObject.value = null;
        this.openNewRequestModal();
      }
      else{
        this._utilityService.showWarningMessage('not_allowed','please_approve_all_cr')
      }
    }
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

  gotoChangeRequestDetails(changeRequestItem){
    event.stopPropagation();
    this._router.navigateByUrl('/event-monitoring/events/'+changeRequestItem.event_id+'/change-request/'+changeRequestItem.id);
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
      this._eventChangeRequestService.delete(this.popupObject.id, EventsStore.selectedEventId).subscribe(res=>{
        // this.pageChange();
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

  editChangeRequest(items){
    event.stopPropagation();
    this.getEventDetails(EventsStore.selectedEventId)
    EventChangeRequestStore.selectedCRId = items.id
    this._eventChangeRequestService.getIndividualItem(EventsStore.selectedEventId,items.id).subscribe(res=>{
      this.changeRequestObject.value = res
      this.changeRequestObject.type = 'Edit'
      this.openNewRequestModal()
      this._utilityService.detectChanges(this._cdr);
    })
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    this.SubMenuItemStore.makeEmpty();
    this.eventChangeReqSubscription.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    EventChangeRequestStore.unsetMenuChoosedListingSubmenu();
  }

}
