import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { ToastrService } from 'ngx-toastr';
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
declare var $: any;
@Component({
  selector: 'app-event-closure-inside-event',
  templateUrl: './event-closure-inside-event.component.html',
  styleUrls: ['./event-closure-inside-event.component.scss']
})
export class EventClosureInsideEventComponent implements OnInit {
  @ViewChild('formModal', {static: true}) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  reactionDisposer: IReactionDisposer;
  EventClosureMainStore = EventClosureMainStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuthStore = AuthStore;
  AppStore = AppStore;

  eventClosureObject = {
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
  popupControlEventSubscription: any;
  closureSubscriptionEvent: any = null;
  EventsStore=EventsStore;
  constructor(
    private _eventClosureEventDetailsService: EventClosureEventDetailsService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _router:Router,
    private _toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {  
     // var subMenuItems =this.getSubmenu()
    if(!AuthStore.getActivityPermission(3200,'EVENT_CLOSURE_CHECKLIST_LIST')){
     NoDataItemStore.deleteObject('subtitle');
     NoDataItemStore.deleteObject('buttonText');
   }

  
   NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_event_closure' })
   

    if (SubMenuItemStore.clikedSubMenuItem) {
     
     switch (SubMenuItemStore.clikedSubMenuItem.type) {
       case "new_modal":
         this.openNewEventClosureModal();
         break;
      case "refresh":
        EventClosureMainStore.unsetEventClosure();
          this.pageChange(1)
          break;
       default:
         break;
     }
     // Don't forget to unset clicked item immediately after using it
     SubMenuItemStore.unSetClickedSubMenuItem();
   } 

     
   });
   if(NoDataItemStore.clikedNoDataItem){
    this.openNewEventClosureModal();
    NoDataItemStore.unSetClickedNoDataItem();
  }

   this.closureSubscriptionEvent = this._eventEmitterService.eventClosureMainModal.subscribe(item => {
    this.closeEventClosure()
    
  })

  this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
    this.modalControl(item);
  })
  this.pageChange(1)
  }

  pageChange(newPage:number = null){
    if (newPage) EventClosureMainStore.setCurrentPage(newPage);
    this._eventClosureEventDetailsService.getItems().subscribe(res=>{
      // this.getSubmenu(res);
      this._utilityService.detectChanges(this._cdr);
      })
  }

  openNewEventClosureModal(){
  
    this.eventClosureObject.type = 'Add';
    this.eventClosureObject.value = null; // for clearing the value
    this.eventClosureObject.id = null;
    this.openModal();
  }

  getSubmenu(res){ 
    var subMenuItems=[];
    subMenuItems.push( {activityName: 'EVENT_CLOSURE_CHECKLIST_LIST', submenuItem: {type: 'refresh'}});    
   if(res.data.length ==0){
      subMenuItems.push({activityName: 'CREATE_EVENT_CLOSURE_CHECKLIST', submenuItem: {type: 'new_modal'}})
   }
   subMenuItems.push({activityName:null, submenuItem: {type: 'close', path: '../'}})
   //return subMenuItems
   this._helperService.checkSubMenuItemPermissions(3700, subMenuItems);
   this._utilityService.detectChanges(this._cdr);
  }

  gotoDetails(id){
    this._router.navigateByUrl(`event-monitoring/events/${EventsStore.selectedEventId}/closure/${id}`)
  }

  getEventClosure(id: number,event)  {
    event.stopPropagation()
    this._eventClosureEventDetailsService.getItem(id).subscribe(res=>{
      this.edit();      
      })
      this._utilityService.detectChanges(this._cdr);
  }

  edit()
  {  
    const singleEventClosure: indivitualEventClosure = EventClosureMainStore.indivitualEventClosure;   
    this.eventClosureObject.value = {
      
      id: singleEventClosure.id,
      title:singleEventClosure.title,
      planned_event_completion:singleEventClosure.event.end_date,
      actual_event_completion_date: singleEventClosure.actual_event_completion_date,
      comments:singleEventClosure.comments,
      scope_of_works:singleEventClosure.scope_of_works,
      event_summary:singleEventClosure.event_summary,
    }

    this.eventClosureObject.type = 'Edit';
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

 

  //modal control event
  modalControl(status: boolean) {
      switch (this.popupObject.title) {
        case 'delete_event_closure': this.deleteEventClosure(status)
          break;
      }
  
    }

     // for delete
  delete(id: number,event) {
    event.stopPropagation();
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
      this._eventClosureEventDetailsService.deleteEventClosure(this.popupObject.id).subscribe(resp => {
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

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.closureSubscriptionEvent.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    this.EventClosureMainStore.unsetIndivitualEventClosure();
  }

}
