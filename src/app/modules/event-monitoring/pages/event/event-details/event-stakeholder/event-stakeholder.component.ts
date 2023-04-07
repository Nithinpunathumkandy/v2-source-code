import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EventStakeholderService } from 'src/app/core/services/event-monitoring/event-stakeholder/event-stakeholder.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventStakeholderStore } from 'src/app/stores/event-monitoring/events/event-stakeholder-store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { autorun, IReactionDisposer } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

declare var $: any;
@Component({
  selector: 'app-event-stakeholder',
  templateUrl: './event-stakeholder.component.html',
  styleUrls: ['./event-stakeholder.component.scss']
})
export class EventStakeholderComponent implements OnInit {

  @ViewChild('viewMore') viewMore: ElementRef;
  @ViewChild('deleteModal', { static: true }) deleteModal: ElementRef;
  @ViewChild('stakeholderModal', { static: true }) stakeholderModal: ElementRef;

  reactionDisposer: IReactionDisposer;

  AppStore = AppStore
  EventsStore = EventsStore
  EventStakeholderStore = EventStakeholderStore

  stakeholderObject = {
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

  viewMoreObject = {
    values: null,
    type: null
  }

  viewMoreSubscription: Subscription
  eventStakeholderSubscription: Subscription
  popupControlEventSubscription: Subscription

  constructor(
    private _router: Router,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    //private _eventTaskService: EventTaskService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _eventStakeholderService: EventStakeholderService,
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
          NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_stakeholder' });
        }
        else
        {
          NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle'});
        }
       
      }, 300);

      if (SubMenuItemStore.clikedSubMenuItem) {
        //submenu selection
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.openNewStakeholder();
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if (NoDataItemStore.clikedNoDataItem) {
        this.openNewStakeholder()
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });

    this.pageChange(1)

    this.eventStakeholderSubscription = this._eventEmitterService.eventStakeholderModal.subscribe(item => {
      this.closeFormModal();
    })

    // for deleting using delete modal
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteStakeholder(item);
    })

    this.viewMoreSubscription = this._eventEmitterService.eventViewMoreModal.subscribe(res => {
      this.closeViewMorePopupModal()
    })
  }

  pageChange(newPage: number = null) {
    if (newPage) EventStakeholderStore.setCurrentPage(newPage);
    this._eventStakeholderService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    })
  }

  callMatrix(){
    this.resetArray()
    this.checkIfPresentBottomLeft(0,3,0,3)
    this.checkIfPresentTopLeft(3,6,0,3)
    this.checkIfPresentBottomRight(0,3,3,6)
    this.checkIfPresentTopRight(3,6,3,6)
  }

  //it'll navigate to details of the page
  gotoDetails(id) {
    this._router.navigateByUrl(`event-monitoring/events/${EventsStore.selectedEventId}/stakeholder/${id}`)
  }

  //this is for opening add task  
  openNewStakeholder() {
    this.stakeholderObject.type = 'Add';
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

  openViewMore(viewMoreArray) {    
    this.viewMoreObject.type = 'Add'
    this.viewMoreObject.values = viewMoreArray
    this.openViewMorePopupModal()
    this._utilityService.detectChanges(this._cdr);
  }

  openViewMorePopupModal() {
    setTimeout(() => {
      $(this.viewMore.nativeElement).modal('show');
    }, 100);
  }

  closeViewMorePopupModal() {
    $(this.viewMore.nativeElement).modal('hide');
    this.viewMoreObject.type = null;
    this.viewMoreObject.values = null
  }

  edit(event, id) {
    event.stopPropagation();
    this._eventStakeholderService.getStakeholderDetails(id).subscribe(res => {
      if (res) {
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
    })
  }

  //setting necessary data and opening the delete popup
  delete(event, id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Stakeholder Anaylsis?';
    this.popupObject.subtitle = 'event_stakeholder_delete_subtitle';
    $(this.deleteModal.nativeElement).modal('show');
  }

  //here we're deleting the particular item
  deleteStakeholder(status: boolean) {
    if (status && this.popupObject.id) {
      this._eventStakeholderService.delete(this.popupObject.id).subscribe(resp => {
        if (resp) {
          this._utilityService.detectChanges(this._cdr);
          this.clearPopupObject();
        }
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

  checkIfPresentBottomLeft(infMin,infMax,supMin,supMax){        
    EventStakeholderStore?.eventStakeholderList?.findIndex(x => {
      if(((infMin<parseInt(x.event_influence_title)) && (parseInt(x.event_influence_title)<=infMax))&& ((supMin<parseInt(x.event_supportive_title)) && (parseInt(x.event_supportive_title)<=supMax)) ){        
        EventStakeholderStore.tempArrayBottomLeft.push(x)        
      }      
    })        
  }

  checkIfPresentBottomRight(infMin,infMax,supMin,supMax){    
    EventStakeholderStore?.eventStakeholderList?.findIndex(x => {
      if(((infMin<parseInt(x.event_influence_title)) && (parseInt(x.event_influence_title)<=infMax))&& ((supMin<parseInt(x.event_supportive_title)) && (parseInt(x.event_supportive_title)<=supMax)) ){        
        EventStakeholderStore.tempArrayBottomRight.push(x)        
      }      
    })    
  }

  checkIfPresentTopRight(infMin,infMax,supMin,supMax){    
    EventStakeholderStore?.eventStakeholderList?.findIndex(x => {
      if(((infMin<parseInt(x.event_influence_title)) && (parseInt(x.event_influence_title)<=infMax))&& ((supMin<parseInt(x.event_supportive_title)) && (parseInt(x.event_supportive_title)<=supMax)) ){        
        EventStakeholderStore.tempArrayTopRight.push(x)        
      }      
    })    
  }

  // this will return risk_ids based on cosequence and likelihood
  checkIfPresentTopLeft(infMin,infMax,supMin,supMax) {//6    3   //  5    2        
    EventStakeholderStore?.eventStakeholderList?.findIndex(x => {
      if(((infMin<parseInt(x.event_influence_title)) && (parseInt(x.event_influence_title)<=infMax))&& ((supMin<parseInt(x.event_supportive_title)) && (parseInt(x.event_supportive_title)<=supMax)) ){                        
        EventStakeholderStore.tempArrayTopLeft.push(x)                        
      }      
    })        
  }

  processArray(matrix){    
    return this._helperService.getArrayProcessed(matrix,'stakeholder').toString();  
  }

  resetArray(){
    EventStakeholderStore.tempArrayBottomLeft=[]
    EventStakeholderStore.tempArrayBottomRight=[]
    EventStakeholderStore.tempArrayTopLeft=[]
    EventStakeholderStore.tempArrayTopRight=[]
  }

  //Don't forget to dispose the reaction disposer and event emitter
  ngOnDestroy(): void {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    EventStakeholderStore.unsetStakeholderList()
    this.viewMoreSubscription.unsubscribe()
    this.eventStakeholderSubscription.unsubscribe()
    this.popupControlEventSubscription.unsubscribe()    
    this.resetArray()
  }

}
