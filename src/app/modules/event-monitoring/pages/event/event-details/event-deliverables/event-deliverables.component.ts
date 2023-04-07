import { ChangeDetectorRef, Component, ElementRef, OnInit , ViewChild } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { EventDeliverableService } from 'src/app/core/services/event-monitoring/event-deliverable/event-deliverable.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { DeliverableMasterStore } from 'src/app/stores/event-monitoring/events/event-deliverable-store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';


declare var $: any;

@Component({
  selector: 'app-event-deliverables',
  templateUrl: './event-deliverables.component.html',
  styleUrls: ['./event-deliverables.component.scss']
})
export class EventDeliverablesComponent implements OnInit {

  reactionDisposer: IReactionDisposer;
  eventSubscriptionEvent: any = null;
  popupControlEventSubscription: any;

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  deliverableObject = {
    id : null,
    type : null,
    values : null
  }

  DeliverableMasterStore = DeliverableMasterStore;
  EventsStore = EventsStore;
  
  Loaded = false

  @ViewChild('newSpecific', {static: true}) newSpecific: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  constructor(
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _deliverableService: EventDeliverableService,
  ) { }

  ngOnInit(): void {
    this.getDeliverables()
    NoDataItemStore.setNoDataItems({title:"No event deliverable has been added", subtitle: 'Click on the below button to add a new event deliverable',buttonText: 'New event deliverable'});
    this.reactionDisposer = autorun(() => {  
      var subMenuItems = [
        //{activityName: 'PROJECT_MONITORING_BUDGET_LIST', submenuItem: {type: 'search'}},
        {activityName: null, submenuItem: {type: 'new_modal'}},
        {activityName:null, submenuItem: {type: 'close', path: '../'}}
     ]
     if(!AuthStore.getActivityPermission(3200,'CREATE_PROJECT_MONITORING_BUDGET')){
      NoDataItemStore.deleteObject('subtitle');
      NoDataItemStore.deleteObject('buttonText');
    }
     this._helperService.checkSubMenuItemPermissions(3700, subMenuItems);

     if (SubMenuItemStore.clikedSubMenuItem) {
      switch (SubMenuItemStore.clikedSubMenuItem.type) {
        case "new_modal":
          this.openNewDeliverableModal();
          break;

        default:
          break;
      }
      // Don't forget to unset clicked item immediately after using it
      SubMenuItemStore.unSetClickedSubMenuItem();
    } 

      if(NoDataItemStore.clikedNoDataItem){
        this.openNewDeliverableModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });
    this.eventSubscriptionEvent = this._eventEmitterService.eventDeliverableModal.subscribe(item => {
      this.closeDeliverable()
      // this.pageChange(1)
    })

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteDeliverables(item);
    })
  }

  
  openNewDeliverable(){
    setTimeout(() => {
      $(this.newSpecific.nativeElement).modal('show');
    }, 100);
  }

  closeDeliverable(){
 
    setTimeout(() => {
      this.deliverableObject.type = null;
      this.deliverableObject.values = null;
      $(this.newSpecific.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 200);
    this.getDeliverables()
  }

  openNewDeliverableModal(){
    this.deliverableObject.type = 'Add';
    this.deliverableObject.values = null; // for clearing the value
    this.openNewDeliverable()

  }

  getDeliverables(){
    this._deliverableService.getItems().subscribe(res => {
      console.log(DeliverableMasterStore.loaded && DeliverableMasterStore.allItems.length > 0)
      this.Loaded = true      
    })
    this._utilityService.detectChanges(this._cdr)
  }

  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'delete_deliverable';
    this.popupObject.subtitle = 'event_deliverable_delete_message';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  deleteDeliverables(status: boolean) {
    if (status && this.popupObject.id) {
      this._deliverableService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.getDeliverables()
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

edit(value){
  event.stopPropagation();
    this.deliverableObject.type = 'Edit';
    this.deliverableObject.values = value;
    this.openNewDeliverable()
    this._utilityService.detectChanges(this._cdr);
    this.deliverableObject.values = value;  
  }

  
  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.eventSubscriptionEvent.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();

  }


  

}
