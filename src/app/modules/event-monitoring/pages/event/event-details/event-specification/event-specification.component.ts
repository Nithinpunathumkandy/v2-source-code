import { ChangeDetectorRef, Component, ElementRef, OnInit , ViewChild } from '@angular/core';
import { EventsSpecificationStore } from 'src/app/stores/event-monitoring/specification-store';
import { EventSpecificationService } from 'src/app/core/services/event-monitoring/events/event-specification/event-specification.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store'; 
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { autorun,IReactionDisposer } from 'mobx';
import { AuthStore } from 'src/app/stores/auth.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';

declare var $: any;
@Component({
  selector: 'app-event-specification',
  templateUrl: './event-specification.component.html',
  styleUrls: ['./event-specification.component.scss']
})
export class EventSpecificationComponent implements OnInit {

  @ViewChild('newSpecific', {static: true}) newSpecific: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  

  EventsSpecificationStore = EventsSpecificationStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  EventsStore=EventsStore;
  AppStore=AppStore 
  newSpecification = {
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
  eventSubscriptionEvent: any = null;
  popupControlEventSubscription: any;
  AuthStore = AuthStore;

  constructor(
    private _specificationService: EventSpecificationService,
    private cdr:ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
   
    if(EventsStore?.eventDetails?.event_status?.type=='draft' || EventsStore?.eventDetails?.event_status?.type=='send-back')
      {
        NoDataItemStore.setNoDataItems({title:"No event specification has been added", subtitle: 'Click on the below button to add a new event specification',buttonText: 'New Event Specification'});
      }
      else
      {
        NoDataItemStore.setNoDataItems({title:"No event specification has been added", subtitle: 'Click on the below button to add a new event specification'});
      }
    
    this.reactionDisposer = autorun(() => {  
      var subMenuItems=[];
      if(EventsStore?.eventDetails?.event_status?.type=='draft' || EventsStore?.eventDetails?.event_status?.type=='send-back')
      {
        subMenuItems.push({activityName: null, submenuItem: {type: 'new_modal'}})
      }
      subMenuItems.push({activityName:null, submenuItem: {type: 'close', path: '../'}})
     if(!AuthStore.getActivityPermission(3200,'CREATE_EVENT_DOCUMENT')){
      NoDataItemStore.deleteObject('subtitle');
      NoDataItemStore.deleteObject('buttonText');
    }
     this._helperService.checkSubMenuItemPermissions(3700, subMenuItems);

     if (SubMenuItemStore.clikedSubMenuItem) {
      switch (SubMenuItemStore.clikedSubMenuItem.type) {
        case "new_modal":
          this.openNewSpecificationModal();
          break;

        default:
          break;
      }
      // Don't forget to unset clicked item immediately after using it
      SubMenuItemStore.unSetClickedSubMenuItem();
    } 

      if(NoDataItemStore.clikedNoDataItem){
        this.openNewSpecificationModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });
    this.eventSubscriptionEvent = this._eventEmitterService.eventSpecificationModal.subscribe(item => {
      this.closeNewSpecification()
      // this.pageChange(1)
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.getEventSpecifications();

  }

  getEventSpecifications(){
    this._specificationService.getItems().subscribe(res=>{this.cdr.detectChanges()});
  }

  
  getEventSpecificationsById(id){
    this._specificationService.getItem(id).subscribe(res=>{this.cdr.detectChanges()});
  }

  openNewSpecificationModal(){
    this.newSpecification.type = 'Add';
    this.newSpecification.value = null; // for clearing the value
    this.openNewSpecification()

  }

  openNewSpecification(){
    setTimeout(() => {
      $(this.newSpecific.nativeElement).modal('show');
    }, 100);
  }

  closeNewSpecification(){
 
    setTimeout(() => {
      this.newSpecification.type = null;
      this.newSpecification.value = null;
      $(this.newSpecific.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  modalControl(status: boolean) {
    switch (this.popupObject.title) {
      case 'delete_specification': this.deleteSpecification(status)
        break;
    }

  }

  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'delete_specification';
    this.popupObject.subtitle = 'event_specification_delete_message';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  deleteSpecification(status: boolean) {
    if (status && this.popupObject.id) {
      this._specificationService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        // this.pageChange(1)
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
  clearPopupObject() {
    this.popupObject.id = null;
}

editSpecification(specification){
  event.stopPropagation();
  this._specificationService.getItem(specification.id).subscribe(res=>{
    
    this.newSpecification.type = 'Edit';
    this.newSpecification.value = res;
    this.openNewSpecification()
    this._utilityService.detectChanges(this._cdr);
  });
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.eventSubscriptionEvent.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();

  }

}

