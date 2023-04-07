import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { autorun, IReactionDisposer } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { EventStakeholderStore } from 'src/app/stores/event-monitoring/events/event-stakeholder-store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventStakeholderService } from 'src/app/core/services/event-monitoring/event-stakeholder/event-stakeholder.service';
declare var $: any;
@Component({
  selector: 'app-event-stakeholder-details',
  templateUrl: './event-stakeholder-details.component.html',
  styleUrls: ['./event-stakeholder-details.component.scss']
})
export class EventStakeholderDetailsComponent implements OnInit, OnDestroy {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('stakeholderModal', { static: true }) stakeholderModal: ElementRef;

  AppStore = AppStore
  EventsStore = EventsStore
  EventStakeholderStore = EventStakeholderStore
  reactionDisposer: IReactionDisposer;

  taskId: number
  matrixTitle: string
  matrixClass: string

  stakeholderObject = {
    id: null,
    type: null,
    value: null,
    values: null
  };

  popupObject = {
    event_id: null,
    position: null,
    type: '',
    subtitle: '',
    task_id: null,
    category: '', 
    title: '',
    id: null,    
  };

  eventStakeholderSubscription: Subscription
  popupControlEventSubscription: Subscription

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _eventStakeholderService: EventStakeholderService,
  ) { }

  ngOnInit(): void {    
    this.route.params.subscribe(params => {
      this.taskId = +params['id']; // (+) converts string 'id' to a number                        
    });

    if (EventsStore.selectedEventId) {
      this.getStakeholderDetails(this.taskId)
    } else {
      this._router.navigateByUrl('event-monitoring/events');
    }

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'edit_modal' } },
        // { activityName: null, submenuItem: { type: 'delete' } },
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
      ];

      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.edit();
            break;
          case "delete":
            this.delete(EventStakeholderStore.IndividualStakeholderDetails?.id);
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    this.eventStakeholderSubscription = this._eventEmitterService.eventStakeholderModal.subscribe(item => {
      this.closeFormModal();
    })

    // for deleting using delete modal
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteStakeholder(item);
    })
  }

  objectChangerCommunication(data) {
    var returnValue = [];
    if (data) {
      for (let i of data) {
        returnValue.push({ title: i.language[0].pivot?.title, id: i.id })
      }
      return this._helperService.getArrayProcessed(returnValue, 'title');
    }

  }

  objConverter(data) {
    return this._helperService.getArrayProcessed(data, 'title');
  }

  objectChanger(data) {
    var returnValue = [];
    for (let i of data) {
      returnValue.push(
        { event_communication_channel_title: i?.language[0].pivot?.title, id: i?.id })
    }
    return returnValue;
  }

  responseChange(data) {
    var returnValue = { id: data?.id, event_engagement_strategy_title: data?.language[0]?.pivot?.title }
    return returnValue
  }

  contractChanger(data) {
    var returnValue = { id: data?.id, project_contract_type_title: data?.language[0]?.pivot?.title }
    return returnValue
  }

  getStakeholderDetails(id) {
    this._eventStakeholderService.getStakeholderDetails(id).subscribe(res => {
      this.matrixFn()
      this._utilityService.detectChanges(this._cdr)
    })
  }

  matrixFn(){
    let influence=parseInt(EventStakeholderStore.IndividualStakeholderDetails?.event_influence?.title)
    let supportive=parseInt(EventStakeholderStore.IndividualStakeholderDetails?.event_supportive?.title)

    if(influence>=4 && influence<=6 && supportive <=6 && supportive >=4){
      this.matrixTitle="Key Players (Partners)"
      this.matrixClass="text-green"
    }
    else if(influence>=4 && influence<=6 && supportive <=3 && supportive >=1){
      this.matrixTitle="Keep Satisfied (Involve)"
      this.matrixClass="text-yellow"
    }
    else if(influence>=1 && influence<=3 && supportive <=6 && supportive >=4){
      this.matrixTitle="Keep Informed (Consult)"
      this.matrixClass="text-orange"}
    else if(influence<=3 && influence>=1 && supportive <=3 && supportive >=1){
      this.matrixTitle="Minimal Effort (Inform)"
      this.matrixClass="text-red"
    }
  }

  //here we're deleting the particular task
  delete(id){    
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Stakeholder Anaylsis?';
    this.popupObject.subtitle = 'event_stakeholder_delete_subtitle';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  //here we're deleting the particular lesson learned
  deleteStakeholder(status: boolean) {
    if (status && this.popupObject.id) {
      this._eventStakeholderService.delete(this.popupObject.id).subscribe(resp => {
        if (resp) {
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
            this._router.navigateByUrl(`event-monitoring/events/${EventsStore.selectedEventId}/stakeholder`);
          }, 500);
          this._utilityService.detectChanges(this._cdr);
          this.clearPopupObject();
        }                
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

  //need to clear the object when we're closing the delete popup
  clearPopupObject() {
    this.popupObject.id = null;
  }

  //user popup box objects
  getResponsibleUser(users, created?: string) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name;
    userDetial['last_name'] = users?.last_name;
    if (created) {
      userDetial['designation'] = users?.designation;
    } else {
      userDetial['designation'] = users?.designation?.title;
    }
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
    userDetial['created_at'] = created ? created : null;
    return userDetial;
  }

  edit() {
    let res = EventStakeholderStore.IndividualStakeholderDetails
    this.stakeholderObject.values = {
      communication_channels: this.objectChanger(res.communication_channels),
      contract_type: this.contractChanger(res.contract_type),
      description: res.description,
      engagement_strategy: this.responseChange(res.engagement_strategy),
      event_influence: res.event_influence,
      event_stakeholder_communication: res.event_stakeholder_communication,
      event_stakeholder_need_and_expectation: res.event_stakeholder_need_and_expectation,
      event_supportive: res.event_supportive,
      id: res.id,
      is_contracted: res.is_contracted,
      stakeholder: res.stakeholder,
      feedback: res.feedback
    }
    this.stakeholderObject.type = 'Edit';
    this._utilityService.detectChanges(this._cdr);
    this.openNewstakeholderModal();
  }

  //it will open add modal
  openNewstakeholderModal() {
    setTimeout(() => {
      $(this.stakeholderModal.nativeElement).modal('show');
    }, 100);
  }

  //it will close add/edit  modal
  closeFormModal() {
    $(this.stakeholderModal.nativeElement).modal('hide');
    this.stakeholderObject.type = null;
  }

  //Don't forget to dispose reaction disposer and unsubscribe eventemitter
  ngOnDestroy(): void {    
    SubMenuItemStore.makeEmpty()
    if (this.reactionDisposer) this.reactionDisposer();
    this.eventStakeholderSubscription.unsubscribe()
    EventStakeholderStore.unsetIndividualStakeholderDetails()
    this.popupControlEventSubscription.unsubscribe()
  }

}
