import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { DeliverableMasterStore } from 'src/app/stores/event-monitoring/events/event-deliverable-store';
import { EventDeliverableService } from 'src/app/core/services/event-monitoring/event-deliverable/event-deliverable.service';
import { EventBudgetService } from 'src/app/core/services/event-monitoring/event-budget/event-budget.service';
import { BudgetStore } from 'src/app/stores/event-monitoring/event-budget-store';
import { EventMilestoneStore } from 'src/app/stores/event-monitoring/event-milestone-store';
import { EventMilestoneService } from 'src/app/core/services/event-monitoring/event-milestone/event-milestone.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { EventMonitoringStore } from 'src/app/stores/event-monitoring/events/event-monitoring.store';
import { EventScopeService } from 'src/app/core/services/event-monitoring/events/event-scope/event-monitoring.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Component({
  selector: 'app-event-closure-details-inside-event',
  templateUrl: './event-closure-details-inside-event.component.html',
  styleUrls: ['./event-closure-details-inside-event.component.scss']
})
export class EventClosureDetailsInsideEventComponent implements OnInit,OnDestroy {
  @ViewChild('formModal', {static: true}) formModal: ElementRef;
  @ViewChild("deliverableModal") deliverableModal: ElementRef;
  @ViewChild('newBudget', {static: true}) newBudget: ElementRef;
  @ViewChild('newMilestone', {static: true}) newMilestone: ElementRef;
  @ViewChild('newScope', {static: true}) newScope: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;
  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;
  reactionDisposer: IReactionDisposer;
  closureId:number;
  AppStore=AppStore
  AuthStore=AuthStore
  EventClosureMainStore = EventClosureMainStore;
  OrganizationGeneralSettingsStore=OrganizationGeneralSettingsStore;
  DeliverableMasterStore = DeliverableMasterStore;
  EventMilestoneStore=EventMilestoneStore;
  EventMonitoringStore=EventMonitoringStore;
  BudgetStore=BudgetStore;
  closureSubscriptionEvent:any;
  deliverableSubscription:any;
  budgetSubscriptionEvent:any;
  eventMileStoneEventSubscrion: any;
  eventScopeEventSubscription:any;
  popupControlEventSubscription:any;
  workflowSubscription:any;
  workflowHistorySubscription:any;
  userMatch: boolean = false;
  workflowHistoryOpened=false;
  workflowModalOpened: boolean=false;
  percentageChecking:boolean=false
  eventClosureObject = {
    id : null,
    type : null,
    value : null
  }
  deliverableObject = {
    id : null,
    type : null,
    values : null
  };
  newBudgetObject = {
    id : null,
    type : null,
    value : null
  }
  newMilestoneObject = {
    id : null,
    type : null,
    value : null
  }
  newScopeObject = {
    id : null,
    type : null,
    value : null
  }
  popupObject = {
		id: null,
		title: '',
		type: '',
		subtitle: ''
	};
  commentFormObject={
    type: '',
    title:''
  }
  selectedItemPos=0;
  selectedItem:number;
  sideTabMenu=[
    {
    id:1,
    name:'Event Budget'
   },
   {
    id:2,
    name:'Event Milestone'
   },
   {
    id:3,
    name:'Event Deliverable'
   },
   {
    id:4,
    name:'Event Scope'
   }
]
  noDeliverables = {
    noData: "No deliverables added", border: false
  }
  noScopeOfWorks = {
    noData: "No event scope added", border: false
  }
  constructor(
    private _eventClosureEventDetailsService: EventClosureEventDetailsService,
    private route:ActivatedRoute,
    private _router:Router,
    private _utilityService:UtilityService,
    private _renderer2: Renderer2,
    private _cdr:ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _deliverableService: EventDeliverableService,
    private _eventBudgetService : EventBudgetService,
    private _eventMilestoneService : EventMilestoneService,
    private _eventScopeService:EventScopeService,
    private _toastr: ToastrService,
  ) { this.getMilestone(1);}


  ngOnInit(): void { 
    this.setSubmenus() 
        if(!AuthStore.getActivityPermission(3200,'EVENT_CLOSURE_CHECKLIST_LIST')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }    
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_event_closure' })
      this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.edit();
            break;
          case "delete":
            this.delete(EventClosureMainStore.closureId);
            break;
          case 'submit':
            SubMenuItemStore.submitClicked = true;
            this.submitApproveWorkflow("submit");
            break;
          case 'approve':
            this.submitApproveWorkflow("approve");
            break;      
          case 'send_back':
            this.revertRejectWorkflow("send_back");
            break;
          case 'reject':
            this.revertRejectWorkflow("reject");
            break;
          case "history":
            this.openHistoryPopup();
            break;
          case "workflow":
            this.openWorkflowPopup();
            break;
          case "new_modal":
              this.openNewEventClosureModal();
              break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.openNewEventClosureModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });
    
    console.log(EventsStore.selectedEventId)
    if (EventsStore.selectedEventId) {
      this.getDetails();
      this.getDeliverables();
      this.getBudgets(1);
      //this.getMilestone(1);
      this.getScopeOfWrk(1);
      this.getMileStonePercentage()
    } else {
      this._router.navigateByUrl('event-monitoring/events');
    }
    this.closureSubscriptionEvent = this._eventEmitterService.eventClosureMainModal.subscribe(item => {
      this.closeEventClosure()
      
    })
    this.deliverableSubscription = this._eventEmitterService.eventDeliverableModal.subscribe(item => {
      this.closeDeliverable()
      // this.pageChange(1)
    })
    this.budgetSubscriptionEvent = this._eventEmitterService.eventBudgetModal.subscribe(item => {
      this.closeNewBudget()
    })
    this.eventMileStoneEventSubscrion = this._eventEmitterService.eventMilestoneModal.subscribe(item => {
      this.closeNewMilestone()
      
    })
    this.eventScopeEventSubscription = this._eventEmitterService.eventScopeModal.subscribe(item => {
      this.closeNewScope()
      
    })

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {      
      this.modalControl(item);
    })

    this.workflowSubscription = this._eventEmitterService.closureWorkflowCommentModal.subscribe(item => {      
      this.closeWorkflowComment();
    })

    this.workflowHistorySubscription = this._eventEmitterService.closureWorkflowHistory.subscribe(element=>{
      this.closeHistoryPopup();
    })
   
  }

  getDetails(){
    this._eventClosureEventDetailsService.getItems().subscribe(res=>{
      if (res['data']?.length>0){
      this._eventClosureEventDetailsService.getItem(res['data'][0].id).subscribe(response=> {
        EventClosureMainStore.closureId=res['data'][0].id
        this.setSubmenus()
        this._utilityService.detectChanges(this._cdr)
      })
    }
      this._utilityService.detectChanges(this._cdr);
      })
  }
  openNewEventClosureModal(){
    if(this.percentageChecking){
      this.eventClosureObject.type = 'Add';
      this.eventClosureObject.value = null; // for clearing the value
      this.eventClosureObject.id = null;
      this.openModal();
    }else{
      this._toastr.warning('warning', 'Milestone progress is not 100%');
    }
  }

  getMileStonePercentage(){
    let tempArray=[]  
    this._eventMilestoneService.getAllItems().subscribe(res=>{
      res.forEach(element => {
        if(parseInt(element.completion)==100){
          tempArray.push(element)
        }
      });
      if(res.length >0){
        this.percentageChecking=(res.length==tempArray.length)
      }else{
        this.percentageChecking=false
      }
      this._utilityService.detectChanges(this._cdr);
    })    
  }

  setSubmenus(){
    this.currentUserCheck();
    var subMenuItems=[];
     subMenuItems = [        
      {activityName:'', submenuItem: {type: 'workflow',title : ''}},
      {activityName:'', submenuItem: {type: 'history',title : ''}},
      {activityName: '', submenuItem: {type: 'new_modal'}}  
        
    ];
    if(EventClosureMainStore?.routeMainListing)
    {
      subMenuItems.push({ activityName: null, submenuItem: { type: 'close', path: '/event-monitoring/event-closures' } })
    }
    else
    {
      subMenuItems.push({ activityName: null, submenuItem: { type: 'close', path: '../' } })
    }
    if(EventClosureMainStore?.indivitualEventClosure?.event_closure_status?.type=='draft' || EventClosureMainStore?.indivitualEventClosure?.event_closure_status?.type=='send-back')
    {
      subMenuItems.push({activityName: 'UPDATE_EVENT_CLOSURE_CHECKLIST', submenuItem: {type: 'edit_modal'}})
      subMenuItems.push({activityName: 'DELETE_EVENT_CLOSURE_CHECKLIST', submenuItem: {type: 'delete'}})
    }

    if(EventClosureMainStore.indivitualEventClosure?.next_review_user_level==1&&EventClosureMainStore.indivitualEventClosure?.submitted_by==null){
      subMenuItems.splice(0, 0, {activityName:'',submenuItem:{type:'submit',title : ''}},)
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);  
       
      this._utilityService.detectChanges(this._cdr);
    }

    if (this.userMatch && EventClosureMainStore.indivitualEventClosure?.submitted_by!=null && EventClosureMainStore.indivitualEventClosure?.next_review_user_level) {
      subMenuItems.push(
        { activityName: null, submenuItem: { type: 'approve',title:'' } },
        { activityName: null, submenuItem: { type: 'send_back',title:'Send Back' } },
        { activityName: null, submenuItem: { type: 'reject',title:'' } },
      )
    }
    this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
    this._utilityService.detectChanges(this._cdr);
  }

  currentUserCheck() {
    if (EventClosureMainStore.indivitualEventClosure) {
      if (EventClosureMainStore.indivitualEventClosure.workflow_items && EventClosureMainStore.indivitualEventClosure.workflow_items.length > 0)
      EventClosureMainStore.indivitualEventClosure.workflow_items.forEach(items => {
          if (items.level == EventClosureMainStore.indivitualEventClosure.next_review_user_level) {
            this.userMatch = items.users.some((user) =>
              user.id == AuthStore?.user?.id)
          }
        })
    }
  }

 
  getDeliverables(){
    this._deliverableService.getItems().subscribe(res => {   
      this._utilityService.detectChanges(this._cdr)
    })
  }
  getMilestone(newPage:number = null){
    if (newPage) EventMilestoneStore.setCurrentPage(newPage);
    this._eventMilestoneService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }
  selectReqItems(pos,id){
    this.selectedItem = id
    this.selectedItemPos = pos;
    if(this.selectedItem==1)
    {
      NoDataItemStore.setNoDataItems({title:"common_nodata_title"});
    }
    else if(this.selectedItem==2)
    {
      NoDataItemStore.setNoDataItems({title:"common_nodata_title"});
    }
    else if(this.selectedItem==3)
    {
      NoDataItemStore.setNoDataItems({title:"common_nodata_title"});
    }
    else if(this.selectedItem==4)
    {
      NoDataItemStore.setNoDataItems({title:"common_nodata_title"});
    }
    
  }
  
  edit()
  {  
    const singleEventClosure: indivitualEventClosure = EventClosureMainStore.indivitualEventClosure;   
    this.eventClosureObject.value = {
      
      id: singleEventClosure?.id,
      planned_event_completion:singleEventClosure?.event.end_date,
      actual_event_completion_date: singleEventClosure?.actual_event_completion_date,
      title:singleEventClosure?.title,
      event_summary:singleEventClosure?.event_summary,
    }
    this.eventClosureObject.type = 'Edit';
    this._utilityService.detectChanges(this._cdr);
    this.openModal();
  }

  closeEventClosure(){
    this.getDetails();
 
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
    console.log("2nd")
    setTimeout(() => {
      $(this.formModal?.nativeElement).modal('show');
    }, 100);
    // this._renderer2.addClass(this.formModal.nativeElement,'show');
    this._renderer2.setStyle(this.formModal?.nativeElement,'display','block');
    this._renderer2.setStyle(this.formModal?.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.formModal?.nativeElement,'z-index',99999);
  }

  editScopeOfWrk(){

  }

  editDeliverable(value)
  {
    event.stopPropagation();
    this.deliverableObject.type = 'Edit from closure';
    this.deliverableObject.values = value;
    this.openNewDeliverable()
    this._utilityService.detectChanges(this._cdr);
    this.deliverableObject.values = value;  
  }

  closeDeliverable(){
 
    setTimeout(() => {
      this.deliverableObject.type = null;
      this.deliverableObject.values = null;
      $(this.deliverableModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 200);
    this.getDeliverables()
  }

  getBudgets(newPage:number = null){
    if (newPage) BudgetStore.setCurrentPage(newPage);
    this._eventBudgetService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getScopeOfWrk(newPage:number = null){
    if (newPage) EventMilestoneStore.setCurrentPage(newPage);
    this._eventScopeService.getScopes().subscribe(res=>{
      console.log(EventMonitoringStore.scopeOfWorks)
      this._utilityService.detectChanges(this._cdr);
    })
  }

  

  openNewDeliverable(){
    setTimeout(() => {
      $(this.deliverableModal.nativeElement).modal('show');
    }, 100);
  }

  getBudgetTotal(){
    let total = 0
    if(BudgetStore.allItems.length > 0){
      BudgetStore.allItems.map(data=>{
        total = Number(total) + Number(data.amount)
      })
    }
    return total
  }

  getGrandTotalBudget(){
    let total = 0
    if(BudgetStore.allItems.length > 0){
      BudgetStore.allItems.map(data=>{
        total = Number(total) + Number(data.amount)
      })
    }
    return total.toFixed(2)
  }
ss
  getTotalActualCost(){
    let total = 0
    if(BudgetStore.allItems.length > 0){
      for(let data of BudgetStore.allItems){
          total = total + Number(data.actual_amount)
      }
    }
    return total.toFixed(2)
  }

 

  editBudget(value){
    event.stopPropagation();
      this.newBudgetObject.type = 'Edit from closure';
      this.newBudgetObject.value = value;
      this.openNewBudget()
      this._utilityService.detectChanges(this._cdr);
    }

  closeNewBudget(){
 
    setTimeout(() => {
      this.newBudgetObject.type = null;
      this.newBudgetObject.value = null;
      $(this.newBudget.nativeElement).modal('hide');
      this._renderer2.removeClass(this.newBudget.nativeElement,'show');
      this._renderer2.setStyle(this.newBudget.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  openNewBudget(){
    setTimeout(() => {
      $(this.newBudget.nativeElement).modal('show');
    }, 100);
    this._renderer2.setStyle(this.newBudget.nativeElement,'display','block');
    this._renderer2.setStyle(this.newBudget.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.newBudget.nativeElement,'z-index',99999);
  }

  openNewMilestone(){
    setTimeout(() => {
      $(this.newMilestone.nativeElement).modal('show');
    }, 100);
    this._renderer2.setStyle(this.newMilestone.nativeElement,'display','block');
    this._renderer2.setStyle(this.newMilestone.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.newMilestone.nativeElement,'z-index',99999);
  }

  closeNewMilestone(){
 
    setTimeout(() => {
      this.newMilestoneObject.type = null;
      this.newMilestoneObject.value = null;
      $(this.newMilestone.nativeElement).modal('hide');
      this._renderer2.removeClass(this.newMilestone.nativeElement,'show');
      this._renderer2.setStyle(this.newMilestone.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  openNewScope(){
    setTimeout(() => {
      $(this.newScope.nativeElement).modal('show');
    }, 100);
    this._renderer2.setStyle(this.newScope.nativeElement,'display','block');
    this._renderer2.setStyle(this.newScope.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.newScope.nativeElement,'z-index',99999);
  }

  closeNewScope(){
 
    setTimeout(() => {
      this.newScopeObject.type = null;
      this.newScopeObject.value = null;
      $(this.newScope.nativeElement).modal('hide');
      this._renderer2.removeClass(this.newScope.nativeElement,'show');
      this._renderer2.setStyle(this.newScope.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  editScope(data){
    this._eventScopeService.getItem(data.id).subscribe(res=>{
    this.newScopeObject.type =  "Edit";
    this.newScopeObject.value = res;
    this.openNewScope()
    this._utilityService.detectChanges(this._cdr);
    })

}

 
  editMileStone(data){
      this._eventMilestoneService.getInduvalMilestons(data.id).subscribe(res=>{
      this.newMilestoneObject.type =  "Edit from closure";
      this.newMilestoneObject.value = res;
      this.openNewMilestone()
      this._utilityService.detectChanges(this._cdr);
      })

  }

 

  openWorkflowPopup() {
    this._eventClosureEventDetailsService.getWorkflow(EventClosureMainStore.closureId).subscribe(res => {
    this.workflowModalOpened = true;
    this._utilityService.detectChanges(this._cdr);
    $(this.workflowModal.nativeElement).modal('show');
    })
  }

  closeWorkflowPopup() {
    this.workflowModalOpened = false;
    $(this.workflowModal.nativeElement).modal('hide');
  }

  revertRejectWorkflow(type) {
    this.commentFormObject.title=type
    this.commentFormObject.type="open"
    EventClosureMainStore.workflowType = type;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  closeWorkflowComment() {
    this.commentFormObject.type = ''
    $(this.commentModal.nativeElement).modal('hide');
    $('.modal-backdrop').remove();
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
    this._utilityService.detectChanges(this._cdr)
  }

  openHistoryPopup() {
    this.workflowHistoryOpened = true;
    this._utilityService.detectChanges(this._cdr);
    $(this.workflowHistory.nativeElement).modal('show');   
  }

  closeHistoryPopup() {
    this.workflowHistoryOpened = false;
    $(this.workflowHistory.nativeElement).modal('hide');
  }

  submitApproveWorkflow(type){
    this.popupObject.type = 'Confirm';
    this.popupObject.title = type;
    this.popupObject.subtitle = `event_closure_${type}_message`;
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 100);
    this._utilityService.detectChanges(this._cdr);
  }

  deleteEventClosure(status: boolean) {
		if (status && this.popupObject.id) {
			this._eventClosureEventDetailsService.deleteEventClosure(this.popupObject.id).subscribe(
				(resp) => {
          this._router.navigateByUrl('/event-monitoring/events');
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

  delete(id: number) {
		event.stopPropagation();
		this.popupObject.type = 'are_you_sure';
		this.popupObject.id = id;
		this.popupObject.title = "are_you_sure";
		this.popupObject.subtitle = "event_closure_delete_subtitle";
		$(this.confirmationPopUp.nativeElement).modal("show");
	}

   // modal control event
   modalControl(status: boolean) {    
    switch (this.popupObject.title) {      
      case 'submit': this.submitAccepted(status)
      break
      case 'approve': this.approveAccepted(status)
      break;
      case 'are_you_sure': this.deleteEventClosure(status);
      break;
    }
  }

  clearPopupObject() {
    this.popupObject.id = null;
  }

  submitAccepted(status){
    if(status){
      this._eventClosureEventDetailsService.submitClosures(EventClosureMainStore.closureId).subscribe(res=>{
        SubMenuItemStore.submitClicked = false;
        this.getDetails()
        this._utilityService.detectChanges(this._cdr);
        this.clearDeleteObject();
      },
      (error)=>{
        SubMenuItemStore.submitClicked = false;
        this.clearDeleteObject();
      })
      
    }else{
      this.clearDeleteObject();
      SubMenuItemStore.submitClicked = false;
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
   }

   approveAccepted(status){
    if(status){
      this._eventClosureEventDetailsService.approveClosures(EventClosureMainStore.closureId).subscribe(res=>{
        SubMenuItemStore.submitClicked = false;
        this.getDetails()
        this._utilityService.detectChanges(this._cdr);
        this.clearDeleteObject();
      },
      (error)=>{
        SubMenuItemStore.submitClicked = false;
        this.clearDeleteObject();
      })
      
    }else{
      this.clearDeleteObject();
      SubMenuItemStore.submitClicked = false;
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
   }

   clearDeleteObject(){
    this.popupObject.id = null;
    this._utilityService.detectChanges(this._cdr);
  }


  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.closureSubscriptionEvent.unsubscribe();
    this.deliverableSubscription.unsubscribe();
    this.budgetSubscriptionEvent.unsubscribe();
    this.eventMileStoneEventSubscrion.unsubscribe();
    this.eventScopeEventSubscription.unsubscribe();
    EventClosureMainStore.unsetIndivitualEventClosure()
    this.popupControlEventSubscription.unsubscribe()
    this.workflowSubscription.unsubscribe()
    this.workflowHistorySubscription.unsubscribe()

  }


}
