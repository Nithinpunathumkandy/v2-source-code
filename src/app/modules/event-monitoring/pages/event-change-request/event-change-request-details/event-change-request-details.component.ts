import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { IReactionDisposer,autorun } from 'mobx';
import { ActivatedRoute, Router } from "@angular/router";
import { EventChangeRequestService } from 'src/app/core/services/event-monitoring/event-change-request/event-change-request.service';
import { EventsService } from 'src/app/core/services/event-monitoring/events/events.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { EventChangeRequestStore } from 'src/app/stores/event-monitoring/events/event-change-request-store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { EventCrWorkflowService } from "src/app/core/services/event-monitoring/event-cr-workflow/event-cr-workflow.service";
import { EventChangeRequestWorkflowStore } from "src/app/stores/event-monitoring/events/event-cr-workflow-store";
import { AuthStore } from 'src/app/stores/auth.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { EventWorkflowStore } from 'src/app/stores/event-monitoring/event-workflow/event-workflow-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { EventFileServiceService } from 'src/app/core/services/event-monitoring/event-file-service/event-file-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { BudgetStore } from 'src/app/stores/event-monitoring/event-budget-store';
import { EventBudgetService } from 'src/app/core/services/event-monitoring/event-budget/event-budget.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ToastrService } from 'ngx-toastr';

declare var $: any;
@Component({
  selector: 'app-event-change-request-details',
  templateUrl: './event-change-request-details.component.html',
  styleUrls: ['./event-change-request-details.component.scss']
})
export class EventChangeRequestDetailsComponent implements OnInit {
  @ViewChild('commentModal') commentModal: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;
  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('changeRequestModal', {static: true}) changeRequestModal: ElementRef;
  @ViewChild('filePreviewModal') filePreviewModal: ElementRef;
  @ViewChild('changeRequestEventDateModal', {static: true}) changeRequestEventDateModal: ElementRef;
  @ViewChild('changeRequestEventBudgetModal', {static: true}) changeRequestEventBudgetModal: ElementRef;
  @ViewChild('changeRequestEventScopeModal', {static: true}) changeRequestEventScopeModal: ElementRef;
  @ViewChild('changeRequestEventDeliverableModal', {static: true}) changeRequestEventDeliverableModal: ElementRef;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  EventChangeRequestStore = EventChangeRequestStore;
  EventsStore = EventsStore;
  EventChangeRequestWorkflowStore = EventChangeRequestWorkflowStore;
  NoDataItemStore=NoDataItemStore;
  BudgetStore=BudgetStore;
  workflowHistoryOpened: boolean = false;
  workflowModalOpened: boolean = false;
  workFlowCommentModalOpened: boolean = false;
  reactionDisposer: IReactionDisposer;
  AppStore = AppStore;
  AuthStore = AuthStore;
  selectedItem=1;
  selectedItemPos: any = 0;
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  changeRequestObject = {
    id : null,
    type : null,
    value : null
  };
  changeRequestEventdateObject = {
    id : null,
    type : null,
    value : null
  }
  changeRequestEventBudgetObject = {
    id : null,
    type : null,
    value : null
  }
  changeRequestEventScopeObject = {
    id : null,
    type : null,
    value : null
  }
  changeRequestEventDeliverableObject = {
    id : null,
    type : null,
    value : null
  }
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: '',
    component: 'organization-policies',
    componentId: null
  }
  sideTabMenu=[
    {
    id:1,
    type:'event-date',
    name:'Event Date'
   },
   
   {
    id:2,
    type:'event-budget',
    name:'Event Budget'
   },
   {
    id:3,
    type:'event-scope',
    name:'Event Scope'
   },
   {
    id:4,
    type:'event-deliverable',
    name:'Event Deliverable'
   },
]

  durationFile:any[] = [];
  budgetFiles: any[] = [];
  scopeFiles: any[] = [];
  statusFiles: any[] = [];
  deliverableFiles: any[] = [];
  popupControlEventSubscription: any = null;
  eventWorkflowHistorySubscription: any = null;
  eventWorkflowSubscription: any = null;
  eventChangeReqSubscription:any =null;
  eventChangeReqEventDateSubscription:any =null;
  eventChangeReqEventBudgetSubscription:any =null;
  eventChangeReqEventScopeSubscription:any =null;
  eventChangeReqEventDeliverableSubscription:any =null;
  constructor(private _eventChangeRequestService: EventChangeRequestService, private _eventsService: EventsService,
    private _helperService: HelperServiceService, private _utilityService: UtilityService, private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef, private _activatedRoute: ActivatedRoute, private _imageService: ImageServiceService,
    private _eventCrWorkflowService: EventCrWorkflowService, private _renderer2: Renderer2, private _sanitizer: DomSanitizer,
    private _eventBudgetService : EventBudgetService,
    private _toastr: ToastrService,
    private _eventFileService: EventFileServiceService, private _documentFileService: DocumentFileService, private _router: Router) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    this.reactionDisposer = autorun(() => {

      if (EventChangeRequestStore.individualChangeRequestItem?.event_change_request_status?.type != 'approved'){
        NoDataItemStore.setNoDataItems({title:"common_nodata_title", subtitle: 'common_nodata_subtitle',buttonText: 'add_change_request_date'});
      }
      else {
        NoDataItemStore.setNoDataItems({title:"common_nodata_title"});
      }
      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case 'edit_modal': this.editChangeRequest();
            break;
          case 'submit':
            SubMenuItemStore.submitClicked = true;
            this.submitChangeRequest();
            break;
          case 'approve':
            this.approveWorkflow();
            break;   
          case 'review_submit':
            this.approveWorkflow(true);
            break   
          case 'send_back':
            this.revertWorkflow();
            break;
          case 'reject':
            this.rejectWorkflow();
            break;
          case "history":
            this.openHistoryPopup();
            break;
          case "workflow":
            this.openWorkflowPopup();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.openModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    this._activatedRoute.params.subscribe(res=>{
      EventChangeRequestStore.unsetDetails()
      let eventId = res['id'];
      let changeRequestId = res['crid'];
      EventChangeRequestStore.selectedCRId = changeRequestId;
      EventsStore.selectedEventId = eventId;
      this.getEventDetails(eventId);
      this.getChangeReqDetails(eventId,changeRequestId);
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.eventWorkflowHistorySubscription = this._eventEmitterService.EventMonitorHistoryModal.subscribe(element=>{
      this.closeHistoryPopup();
    })
    this.eventWorkflowSubscription = this._eventEmitterService.EventApproveCommentModal.subscribe(element=>{
      this.closeCommentForm();
      this.getChangeReqDetails(EventsStore.selectedEventId, EventChangeRequestStore.selectedCRId)
    })
    this.eventChangeReqSubscription = this._eventEmitterService.eventChangeReqModal.subscribe(item => {
      this.closeChangeRequestModal()
    });
    this.eventChangeReqEventDateSubscription = this._eventEmitterService.eventChangeReqEventDateModal.subscribe(item => {
      this.closeChangeRequestEventDateModal()
    });

    this.eventChangeReqEventBudgetSubscription = this._eventEmitterService.eventChangeReqEventBudgetModal.subscribe(item => {
      this.closeChangeRequestEventBudgetModal()
    });
    this.eventChangeReqEventScopeSubscription = this._eventEmitterService.eventChangeReqEventScopeModal.subscribe(item => {
      this.closeChangeRequestEventScopeModal()
    });
    this.eventChangeReqEventDeliverableSubscription = this._eventEmitterService.eventChangeReqEventDeliverableModal.subscribe(item => {
      this.closeChangeRequestEventDeliverableModal()
    });
  }

  getEventDetails(id){
    this._eventsService.getItem(id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }
  
  getChangeReqDetails(eventId, changeRequestId){
    this._eventChangeRequestService.getIndividualItem(eventId,changeRequestId).subscribe(res=>{
      this.processDocuments();
      this.getWorkflowDetails(changeRequestId);     
      
      this._utilityService.detectChanges(this._cdr);
    })
  }
  openModal()
  {
    if(this.selectedItem==1)
    {
      this.editChangeRequestEventDate();
    }
    else if(this.selectedItem==2)
    {
      this.editChangeRequestEventBudget();
    }
    else if(this.selectedItem==3)
    {
      this.editChangeRequestEventScope();
    }
    else{
      this.editChangeRequestEventDeliverable();
    }
  }


  getWorkflowDetails(changeRequestId){
    this._eventCrWorkflowService.getWorkflowDetails(changeRequestId).subscribe(res=>{
      setTimeout(() => {
        this.setSubMenu();
      }, 150);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  processDocuments(){
    this.durationFile = this.EventChangeRequestStore.individualChangeRequestItem.event_date ? this.EventChangeRequestStore.individualChangeRequestItem.event_date.documents : [];
    this.statusFiles = this.EventChangeRequestStore.individualChangeRequestItem.event_status ? this.EventChangeRequestStore.individualChangeRequestItem.event_status.documents : [];
    let scopeLength = this.EventChangeRequestStore.individualChangeRequestItem.event_scope.length;
    if(scopeLength > 0) this.scopeFiles = this.EventChangeRequestStore.individualChangeRequestItem.event_scope[scopeLength-1].documents;
    let budgetLength = this.EventChangeRequestStore.individualChangeRequestItem.event_budget.length;
    if(budgetLength > 0) this.budgetFiles = this.EventChangeRequestStore.individualChangeRequestItem.event_budget[budgetLength-1].documents;
    let deliverableLength = this.EventChangeRequestStore.individualChangeRequestItem.event_change_request_deliverable.length;
    if(deliverableLength > 0) this.deliverableFiles = this.EventChangeRequestStore.individualChangeRequestItem.event_change_request_deliverable[deliverableLength-1].documents;
    this._utilityService.detectChanges(this._cdr);
  }

  getPath(){
    let path = '/event-monitoring/event-change-requests';
    if(AppStore.previousUrl){
       path = AppStore.previousUrl;
    }
    return path;
  }

  setSubMenu(){
    if(EventChangeRequestStore.individualChangeRequestItem?.next_review_user_level==1 && EventChangeRequestStore.individualChangeRequestItem?.submitted_by==null){
      var subMenuItems = [
        {activityName:'', submenuItem: {type: 'workflow',title : ''}},
        {activityName:'', submenuItem: {type: 'history',title : ''}},
        {activityName:'',submenuItem:{type:'submit',title : ''}},
        {activityName: null, submenuItem: {type: 'close', path: this.getPath(),title : ''}},
      ]
      if(EventChangeRequestStore.individualChangeRequestItem?.event_change_request_status?.type=='draft' || EventChangeRequestStore.individualChangeRequestItem?.event_change_request_status?.type=='send-back')
      {
        subMenuItems.push({ activityName:'', submenuItem: { type: 'edit_modal',title : '' } });
      }
      subMenuItems.push( {activityName: null, submenuItem: {type: 'close', path: this.getPath(),title : ''}});
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);  
       
      this._utilityService.detectChanges(this._cdr);
    }   else if(EventChangeRequestStore.individualChangeRequestItem?.submitted_by!=null && EventChangeRequestStore.individualChangeRequestItem?.next_review_user_level && this.isUser()){
      if (EventChangeRequestStore.individualChangeRequestItem?.next_review_user_level == EventChangeRequestWorkflowStore?.eventChangeRequestWorkflow[EventChangeRequestWorkflowStore?.eventChangeRequestWorkflow?.length - 1]?.level){
        var subMenuItems = [
          {activityName:'', submenuItem: {type: 'workflow',title : ''}},
          {activityName:'', submenuItem: {type: 'history',title : ''}},
          {activityName:'',submenuItem:{type:'approve',title : ''}},
          {activityName:'',submenuItem:{type:'send_back',title:'Send Back'}},
          {activityName:'',submenuItem:{type:'reject',title:''}},

          {activityName:null, submenuItem: {type: 'close', path: this.getPath(),title : ''}}
        ]
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
        this._utilityService.detectChanges(this._cdr);
      }
      else if (EventChangeRequestStore.individualChangeRequestItem?.next_review_user_level != EventChangeRequestWorkflowStore?.eventChangeRequestWorkflow[EventChangeRequestWorkflowStore?.eventChangeRequestWorkflow?.length - 1]?.level){
        var subMenuItems  = [
          {activityName:'', submenuItem: {type: 'workflow',title : ''}},
          {activityName:'', submenuItem: {type: 'history',title : ''}},
          {activityName:'',submenuItem:{type:'review_submit',title : 'Approve'}},
          {activityName:'',submenuItem:{type:'send_back',title:'Send Back'}},
          {activityName:'',submenuItem:{type:'reject',title:''}},
          {activityName:null, submenuItem: {type: 'close', path: this.getPath(),title : ''}}
        ]
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
        this._utilityService.detectChanges(this._cdr);
      } 
      
    }else if (EventChangeRequestStore.individualChangeRequestItem?.next_review_user_level == null && EventChangeRequestStore.individualChangeRequestItem?.submitted_by!=null){
      var subMenuItems  = [
        {activityName:'', submenuItem: {type: 'workflow',title : ''}},
        {activityName:'', submenuItem: {type: 'history',title : ''}},
        {activityName:null, submenuItem: {type: 'close', path: this.getPath(),title : ''}}
      ]
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
      this._utilityService.detectChanges(this._cdr);
    }
    
    else{
         subMenuItems=[];
         subMenuItems = [
          {activityName:'', submenuItem: {type: 'workflow',title : ''}},
          {activityName:'', submenuItem: {type: 'history',title : ''}},        
        ]
        if(EventChangeRequestStore.individualChangeRequestItem?.event_change_request_status?.type=='draft' || EventChangeRequestStore.individualChangeRequestItem?.event_change_request_status?.type=='send-back')
        {
          subMenuItems.push({ activityName:'', submenuItem: { type: 'edit_modal',title : '' } });
        }
        subMenuItems.push({activityName:null, submenuItem: {type: 'close', path: this.getPath(),title : ''}})
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
      }
  }

  isUser() {
    if(EventChangeRequestStore?.individualLoaded){
      for (let i of EventChangeRequestStore.individualChangeRequestItem?.workflow_items) {
        if (i.level == EventChangeRequestStore.individualChangeRequestItem?.next_review_user_level) {
          var pos = i.users?.findIndex(e => e.id == AuthStore.user.id)
            if (pos != -1){
              return true;
            }
            else{
              return false
            }
        }
      }
    }
    else{
      return false;
    }
    
  }

  createImageUrl(type, token) {
    if(type=='document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    else
      return this._eventFileService.getThumbnailPreview(type,token);
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  editChangeRequest(){
    this.changeRequestObject.value = EventChangeRequestStore.individualChangeRequestItem;
    this.changeRequestObject.type = 'Edit'
    this.openNewRequestModal()
    this._utilityService.detectChanges(this._cdr);
  }

  openNewRequestModal(){
    setTimeout(() => {
      $(this.changeRequestModal.nativeElement).modal('show');
    }, 100);
  }

  closeChangeRequestModal(){
    this.changeRequestObject.type = null;
    setTimeout(() => {
      $(this.changeRequestModal.nativeElement).modal('hide');
    }, 100);
  }


  editChangeRequestEventDate(){
    this.changeRequestEventdateObject.value = EventChangeRequestStore.individualChangeRequestItem;
    this.changeRequestEventdateObject.type = 'Edit'
    this.openNewEventDateRequestModal()
    this._utilityService.detectChanges(this._cdr);
  }

  openNewEventDateRequestModal(){
    setTimeout(() => {
      $(this.changeRequestEventDateModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.changeRequestEventDateModal.nativeElement,'overflow','auto');
      this._renderer2.setStyle(this.changeRequestEventDateModal.nativeElement,'z-index',99999);
      
    }, 100);
  }

  closeChangeRequestEventDateModal(){
    this.changeRequestEventdateObject.type = null;
    this.getChangeReqDetails(EventsStore.selectedEventId,EventChangeRequestStore.selectedCRId)
    setTimeout(() => {
      $(this.changeRequestEventDateModal.nativeElement).modal('hide');
    }, 100);
  }

  editChangeRequestEventBudget(){
    this.changeRequestEventBudgetObject.value = EventChangeRequestStore.individualChangeRequestItem;
    this.changeRequestEventBudgetObject.type = 'Edit'
    this.openNewEventBudgetRequestModal()
    this._utilityService.detectChanges(this._cdr);
  }

  openNewEventBudgetRequestModal(){
    setTimeout(() => {
      $(this.changeRequestEventBudgetModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.changeRequestEventBudgetModal.nativeElement,'overflow','auto');
      this._renderer2.setStyle(this.changeRequestEventBudgetModal.nativeElement,'z-index',99999);
    }, 100);
  }

  closeChangeRequestEventBudgetModal(){
    this.changeRequestEventBudgetObject.type = null;
    this.getChangeReqDetails(EventsStore.selectedEventId,EventChangeRequestStore.selectedCRId)
    setTimeout(() => {
      $(this.changeRequestEventBudgetModal.nativeElement).modal('hide');
    }, 100);
  }


  editChangeRequestEventScope(){
    this.changeRequestEventScopeObject.value = EventChangeRequestStore.individualChangeRequestItem;
    this.changeRequestEventScopeObject.type = 'Edit'
    this.openNewEventScopeRequestModal()
    this._utilityService.detectChanges(this._cdr);
  }

  openNewEventScopeRequestModal(){
    setTimeout(() => {
      $(this.changeRequestEventScopeModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.changeRequestEventScopeModal.nativeElement,'overflow','auto');
      this._renderer2.setStyle(this.changeRequestEventScopeModal.nativeElement,'z-index',99999);
    }, 100);
  }

  closeChangeRequestEventScopeModal(){
    this.changeRequestEventScopeObject.type = null;
    this.getChangeReqDetails(EventsStore.selectedEventId,EventChangeRequestStore.selectedCRId)
    setTimeout(() => {
      $(this.changeRequestEventScopeModal.nativeElement).modal('hide');
    }, 100);
  }


  editChangeRequestEventDeliverable(){
    this.changeRequestEventDeliverableObject.value = EventChangeRequestStore.individualChangeRequestItem;
    this.changeRequestEventDeliverableObject.type = 'Edit'
    this.openNewEventDeliverableRequestModal()
    this._utilityService.detectChanges(this._cdr);
  }

  openNewEventDeliverableRequestModal(){
    setTimeout(() => {
      $(this.changeRequestEventDeliverableModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.changeRequestEventDeliverableModal.nativeElement,'overflow','auto');
      this._renderer2.setStyle(this.changeRequestEventDeliverableModal.nativeElement,'z-index',99999);
    }, 100);
  }

  closeChangeRequestEventDeliverableModal(){
    this.changeRequestEventDeliverableObject.type = null;
    this.getChangeReqDetails(EventsStore.selectedEventId,EventChangeRequestStore.selectedCRId)
    setTimeout(() => {
      $(this.changeRequestEventDeliverableModal.nativeElement).modal('hide');
    }, 100);
  }

  getNewAmountTotal(){
    let amount = 0
    if(EventChangeRequestStore.individualChangeRequestItem?.event_budget.length > 0){
      for(let data of EventChangeRequestStore.individualChangeRequestItem?.event_budget){
        if(!data.is_deleted){
          amount = amount + Number(data.new_amount)
        }
      }
    }
    
    return amount
  }

  getExistingTotal(){
    let amount = 0
   if(EventChangeRequestStore.individualChangeRequestItem?.event_budget.length > 0){
     for(let data of EventChangeRequestStore.individualChangeRequestItem?.event_budget){
      if(!data.is_deleted)
        {
          amount = amount + Number(data.existing_amount)
        }
      
     }
   }
   
   return amount
  }

  selectDaysDiffrence(){
    if(EventsStore.eventDetails?.start_date && EventChangeRequestStore.individualChangeRequestItem?.event_date?.new_start_date){
      let startDate : any = EventsStore.eventDetails?.start_date;
      let endDate : any   =  EventChangeRequestStore.individualChangeRequestItem?.event_date?.new_start_date;
      
      const diffInMs   = Number(new Date(endDate)) - Number(new Date(startDate))
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
       return diffInDays
    }
  
  }

  selectReqItems(pos,id){
    this.selectedItem = id
    this.selectedItemPos = pos;
    if(this.selectedItem==1 && (EventChangeRequestStore.individualChangeRequestItem?.event_change_request_status?.type == 'draft' || EventChangeRequestStore.individualChangeRequestItem?.event_change_request_status?.type == 'send-back') )
    {
      NoDataItemStore.setNoDataItems({title:"common_nodata_title", subtitle: 'common_nodata_subtitle',buttonText: 'add_change_request_date'});
    }
    else if(this.selectedItem==2 && (EventChangeRequestStore.individualChangeRequestItem?.event_change_request_status?.type == 'draft' || EventChangeRequestStore.individualChangeRequestItem?.event_change_request_status?.type == 'send-back') )
    {
      NoDataItemStore.setNoDataItems({title:"common_nodata_title", subtitle: 'common_nodata_subtitle',buttonText: 'add_change_request_budget'});
    }
    else if(this.selectedItem==3 && (EventChangeRequestStore.individualChangeRequestItem?.event_change_request_status?.type == 'draft' || EventChangeRequestStore.individualChangeRequestItem?.event_change_request_status?.type == 'send-back'))
    {
      NoDataItemStore.setNoDataItems({title:"common_nodata_title", subtitle: 'common_nodata_subtitle',buttonText: 'add_change_request_scope'});
    }
    
    else if(this.selectedItem==4 && (EventChangeRequestStore.individualChangeRequestItem?.event_change_request_status?.type == 'draft' || EventChangeRequestStore.individualChangeRequestItem?.event_change_request_status?.type == 'send-back'))
    {
      NoDataItemStore.setNoDataItems({title:"common_nodata_title", subtitle: 'common_nodata_subtitle',buttonText: 'add_change_request_deliverable'});
    }
     else {
      NoDataItemStore.setNoDataItems({title:"common_nodata_title"});
    }
    
  }
  
  selectEndDaysDiffrence(){
    if(EventsStore.eventDetails?.start_date && EventChangeRequestStore.individualChangeRequestItem?.event_date?.new_end_date){
      let startDate : any = EventsStore.eventDetails?.start_date;
      let endDate : any   =  EventChangeRequestStore.individualChangeRequestItem?.event_date?.new_end_date;
      
      const diffInMs   = Number(new Date(endDate)) - Number(new Date(startDate))
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
       return diffInDays
    }
  
  }

  getPopupDetails(user,is_created_by:boolean = false){
    let userDetailObject: any = {};
    if(user){
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title? user.designation_title: user.designation ? user.designation : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email: null;
      userDetailObject['mobile'] = user.mobile ? user.mobile: null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof(user.department) == 'string' ? user.department : user.department?.title ? user.department?.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if(is_created_by) userDetailObject['created_at'] = new Date();
      return userDetailObject;
    }
  }

  getStatusColor(color){
    let colorSplit
    if(color){
      if(color.indexOf('-dot') != -1) colorSplit = color.split('-dot');
      else colorSplit = color.split('-');
      return colorSplit[0];
    }
    else{
      return '';
    }
  }

  checkScopeTypePresent(type,key,scopeArray){
    if(scopeArray && scopeArray.length > 0){
      let pos = scopeArray.findIndex(e => e[key] == type);
      return pos;
    }
    else{
      return -1
    }
  }

  openHistoryPopup() {
    EventChangeRequestWorkflowStore.workflowHistoryPage = 1;
    this._eventCrWorkflowService.getWorkflowHistory(EventChangeRequestStore.selectedCRId).subscribe(res => {
      this.workflowHistoryOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowHistory.nativeElement).modal('show');
    });
  }

  closeHistoryPopup() {
    this.workflowHistoryOpened = false;
    $(this.workflowHistory.nativeElement).modal('hide');
  }

  openWorkflowPopup() {
    this._eventCrWorkflowService.getWorkflowDetails(EventChangeRequestStore.selectedCRId).subscribe(res => {
      this.workflowModalOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'auto');
    })
  }

  closeWorkflowPopup() {
    this.workflowModalOpened = false;
    $(this.workflowModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
  }

  submitChangeRequest(){
    
    if ( EventChangeRequestStore.individualChangeRequestItem?.event_budget.length==0 &&
         EventChangeRequestStore.individualChangeRequestItem?.event_change_request_deliverable.length==0 &&
         EventChangeRequestStore.individualChangeRequestItem?.event_scope.length==0 &&
         !EventChangeRequestStore.individualChangeRequestItem?.event_date
      ){
        SubMenuItemStore.submitClicked = false;
        // this._toastr.warning('warning', 'Please change any items before submit');
        this._toastr.warning('warning', this._helperService.translateToUserLanguage('Please change any items before submit'));

    }
    else {
      this.popupObject.type = 'Confirm';
      this.popupObject.title = 'submit';
      this.popupObject.subtitle = 'event_cr_workflow_submit_message';
      setTimeout(() => {
        $(this.confirmationPopUp.nativeElement).modal('show');
      }, 100);
    }
      
    this._utilityService.detectChanges(this._cdr);
  }

   // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.title) {
      case 'submit': this.submitAccepted(status)
    }
  }
  
  revertWorkflow() {
    EventWorkflowStore.type = 'revert';
    this.workFlowCommentModalOpened = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  
  rejectWorkflow() {
    EventWorkflowStore.type = 'reject';
    this.workFlowCommentModalOpened = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  approveWorkflow(type?) {
    if (type) EventWorkflowStore.type = 'submit';
    else EventWorkflowStore.type = 'approve';
    this.workFlowCommentModalOpened = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }
  
  closeCommentForm() {
    this.setSubMenu();
    EventWorkflowStore.type = '';
    this.workFlowCommentModalOpened = false;
    $(this.commentModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  
    this._utilityService.detectChanges(this._cdr)
  }

  submitAccepted(status){
    if(status){
      this._eventCrWorkflowService.submitForWorkflow(EventChangeRequestStore.selectedCRId).subscribe(res=>{
        SubMenuItemStore.submitClicked = false;
        this.getChangeReqDetails(EventsStore.selectedEventId,EventChangeRequestStore.selectedCRId)
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

  downloadDocumentFile(type, document, docs?) {
    console.log(document);
    event.stopPropagation();
    switch (type) {
      case "event-status":
        this._eventFileService.downloadFile(
          type,
          EventChangeRequestStore.individualChangeRequestItem.event.id,
          EventChangeRequestStore.individualChangeRequestItem.id,
          document.event_change_request_event_status_id,
          document.title,
          document
        );
        break;
      case "event-scope":
        this._eventFileService.downloadFile(
          type,
          EventChangeRequestStore.individualChangeRequestItem.event.id,
          EventChangeRequestStore.individualChangeRequestItem.id,
          document.event_change_request_event_scope_id,
          document.title,
          document
        );
        break;
      case "event-budget":
        this._eventFileService.downloadFile(
          type,
          EventChangeRequestStore.individualChangeRequestItem.event.id,
          EventChangeRequestStore.individualChangeRequestItem.id,
          document.event_change_request_event_budget_id,
          document.title,
          document
        );
        break;
      case "event-date":
        this._eventFileService.downloadFile(
          type,
          EventChangeRequestStore.individualChangeRequestItem.event.id,
          EventChangeRequestStore.individualChangeRequestItem.id,
          document.event_change_request_event_date_id,
          document.title,
          document
        );
        break;
      case "document-version":
        this._documentFileService.downloadFile(
          type,
          document.document_id,
          docs.id,
          null,
          document.title,
          docs
        );
        break;
    }
  }

  /**
   * View brochure
   * @param brochureItem Details of brochure
   * @param id Subsidiary Id
   */
  viewBrochureItem(type, brochureItem, id) {
    switch (type) {
      case 'document-version':
        this._documentFileService
          .getFilePreview(type, brochureItem.document_id, id.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              brochureItem.title
            );
            this.openPreviewModal(type, resp, id, brochureItem);
          }),
          (error) => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage(
                "Error",
                "Permission Denied"
              );
            } else {
              this._utilityService.showErrorMessage(
                "Error",
                "Unable to generate Preview"
              );
            }
          };

        break;

      case 'event-status':
        this._eventFileService.getFilePreview('event-status',EventChangeRequestStore.individualChangeRequestItem.event.id,EventChangeRequestStore.individualChangeRequestItem.id,brochureItem.event_change_request_event_status_id,brochureItem).subscribe(res => {
          var resp: any = this._utilityService.getDownLoadLink(res, brochureItem.name);
          this.openPreviewModal(type,resp, brochureItem, id);
        }), (error => {
          if (error.status == 403) {
            this._utilityService.showErrorMessage('error', 'permission_denied');
          }
          else {
            this.openPreviewModal(type,null, brochureItem, id);
          }
        });
      break;
      case 'event-scope':
        this._eventFileService.getFilePreview('event-scope',EventChangeRequestStore.individualChangeRequestItem.event.id,EventChangeRequestStore.individualChangeRequestItem.id,brochureItem.event_change_request_event_scope_id, brochureItem).subscribe(res => {
          var resp: any = this._utilityService.getDownLoadLink(res, brochureItem.name);
          this.openPreviewModal(type,resp, brochureItem, id);
        }), (error => {
          if (error.status == 403) {
            this._utilityService.showErrorMessage('error', 'permission_denied');
          }
          else {
            this.openPreviewModal(type,null, brochureItem, id);
          }
        });
        break;
        case 'event-budget':
          this._eventFileService.getFilePreview('event-budget',EventChangeRequestStore.individualChangeRequestItem.event.id,EventChangeRequestStore.individualChangeRequestItem.id,brochureItem.event_change_request_event_budget_id, brochureItem).subscribe(res => {
            var resp: any = this._utilityService.getDownLoadLink(res, brochureItem.name);
            this.openPreviewModal(type,resp, brochureItem, id);
          }), (error => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage('error', 'permission_denied');
            }
            else {
              this.openPreviewModal(type,null, brochureItem, id);
            }
          });
          break;
          case 'event-date':
            this._eventFileService.getFilePreview('event-date',EventChangeRequestStore.individualChangeRequestItem.event.id,EventChangeRequestStore.individualChangeRequestItem.id,brochureItem.event_change_request_event_date_id, brochureItem).subscribe(res => {
              var resp: any = this._utilityService.getDownLoadLink(res, brochureItem.name);
              this.openPreviewModal(type,resp, brochureItem, id);
            }), (error => {
              if (error.status == 403) {
                this._utilityService.showErrorMessage('error', 'permission_denied');
              }
              else {
                this.openPreviewModal(type,null, brochureItem, id);
              }
            });
            break;

      default:
        break;
    }
  }

  openPreviewModal(type, filePreview, documentFiles, document) {
    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.uploaded_user = this.EventChangeRequestStore.individualChangeRequestItem.created_by ? this.EventChangeRequestStore.individualChangeRequestItem.created_by : null;
      this.previewObject.created_at = this.EventChangeRequestStore.individualChangeRequestItem.created_at ? this.EventChangeRequestStore.individualChangeRequestItem.created_at : '';
      if(type=='document-version'){
        this.previewObject.component=type
        this.previewObject.componentId = document.id;
      }
      else{
        this.previewObject.componentId = documentFiles.organization_policy_id;
        this.previewObject.component = type;
      }
      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }

  // Close brochure preview
  closePreviewModal(event) {
    $(this.filePreviewModal.nativeElement).modal('hide');
    this.previewObject.preview_url = '';
    this.previewObject.file_details = null;
    this.previewObject.componentId = null;
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = '';
  }
  getNoDataSource(type,message){
    let noDataSource = {
      noData: message, border: false, imageAlign: type
    }
    return noDataSource;
  }

  ngOnDestroy(){
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    if (this.reactionDisposer) this.reactionDisposer();
    this.eventWorkflowSubscription.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    this.eventWorkflowHistorySubscription.unsubscribe();
    this.eventChangeReqSubscription.unsubscribe();
    this.eventChangeReqEventDateSubscription.unsubscribe();
    this.eventChangeReqEventBudgetSubscription.unsubscribe();
    this.eventChangeReqEventScopeSubscription.unsubscribe();
  }

}
