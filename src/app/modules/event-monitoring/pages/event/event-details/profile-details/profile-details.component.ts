import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { AppStore } from "src/app/stores/app.store";
import { AuthStore } from "src/app/stores/auth.store";
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { EventFileServiceService } from 'src/app/core/services/event-monitoring/event-file-service/event-file-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { EventsService } from 'src/app/core/services/event-monitoring/events/events.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { Router } from '@angular/router';
import { EventWorkflowService } from 'src/app/core/services/event-monitoring/event-workflow/event-workflow.service';
import { EventWorkflowStore } from 'src/app/stores/event-monitoring/event-workflow/event-workflow-store';
import { DeliverableMasterStore } from 'src/app/stores/event-monitoring/events/event-deliverable-store';
import { EventDeliverableService } from 'src/app/core/services/event-monitoring/event-deliverable/event-deliverable.service';
declare var $: any;

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit {

  @ViewChild("addEventOutcome", {static: true}) addEventOutcome: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;
  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('validationCheck', {static: true}) validationCheck: ElementRef;
  @ViewChild('newSpecific', {static: true}) newSpecific: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  // @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  reactionDisposer: IReactionDisposer;
  EventsStore = EventsStore;
  EventWorkflowStore = EventWorkflowStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  Loaded = false;
  DeliverableMasterStore = DeliverableMasterStore;
  eventSubscriptionEvent: any = null;

  popupObject = {
		id: null,
		title: '',
		type: '',
		subtitle: ''
	};

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };

  outcomeObject = {
    id : null,
    type : null,
    values : null
  }
  validationPopupObject = {
    type : null,
    id : null,
    value : null,
  };
  emptyMessage="No documents added";

  deliverableObject = {
    id : null,
    type : null,
    values : null
  };
  

  addOutcomeSubscription: any;
  confirmationSubscription: any;
  popupControlEventSubscription: any;
  eventWorkflowHistorySubscription: any;
  eventWorkflowSubscription: any;
  eventWorkflowCommentSubscription: any;
  idleTimeoutSubscription: any;
	networkFailureSubscription: any;
  previewFocusSubscription: any;
  noDataSourceOutcome = {
    noData: "No outcomes added", border: false
  }
 
  noDeliverables = {
    noData: "No deliverables added", border: false
  }

  workflowModalOpened: boolean=false;
  workflowHistoryOpened=false;
  scopeValidation=false;
  exclusionScopeValidation=false;
  assumptionScopeValidation=false;
  validationCheckEventSubscription: any;
  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _documentFileService: DocumentFileService,
    private _eventFileService: EventFileServiceService, private _router: Router,
    private _imageService: ImageServiceService, private _helperService: HelperServiceService,
    private _sanitizer: DomSanitizer, private _eventService: EventsService,
    private _eventWorkflowService: EventWorkflowService,
    private _eventsService: EventsService,
    private _deliverableService: EventDeliverableService,

  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      if(EventsStore.selectedEventId){
        this.getIndividualEvent(EventsStore.selectedEventId)
      }
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case 'edit_modal': this._router.navigateByUrl(`/event-monitoring/events/edit`);
            break;
          case 'submit':
            //SubMenuItemStore.submitClicked = true;
            this.validationStatusCheck()
            //this.submitEvent();
            break;
          case 'approve':
            this.approveWorkflow();
            break;      
          case 'revert':
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
      
    })

    this.getDeliverables();

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
			if (!status && $(this.filePreviewModal.nativeElement).hasClass('show')) {
				this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 999999);
				this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'auto');
			}
		})

		this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
			if (!status && $(this.filePreviewModal.nativeElement).hasClass('show')) {
				this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 999999);
				this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'auto');
			}
		})

    this.addOutcomeSubscription = this._eventEmitterService.eventOutcomeModalControl.subscribe(element => {
			if (!element) {
				this.closeAddOutcome();
			}
		})

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      //console.log(item)
      this.modalControl(item);
    })

    this.eventWorkflowHistorySubscription = this._eventEmitterService.EventMonitorHistoryModal.subscribe(element=>{
      this.closeHistoryPopup();
    })

    this.eventWorkflowSubscription = this._eventEmitterService.EventApproveCommentModal.subscribe(element=>{
      this.closeCommentForm();
      this.getIndividualEvent(EventsStore.selectedEventId)
    })
    this.validationCheckEventSubscription = this._eventEmitterService.eventMonitoriingValidationModal.subscribe(item => {
      this.closeValidationPopup()
    })

    this.previewFocusSubscription = this._eventEmitterService.previewFocus.subscribe(res => {
			this.setPreviewFocus();
		})

    // this.eventWorkflowCommentSubscription = this._eventEmitterService.planMeasureMainHistory.subscribe(element=>{
    //   this.closeWorkflowPopup();
    // })

    // this.confirmationSubscription = this._eventEmitterService.deletePopup.subscribe(res=>{
    //   console.log(res)
    //   this.removeExpectedOutcome(res);
    // })
    SubMenuItemStore.setNoUserTab(true);

    // setTimeout(() => {
      // this.setSubMenuItems(EventsStore.eventDetails);
    // }, 100);

    this.getOutcomes();
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteDeliverables(item);      
    })

    this.eventSubscriptionEvent = this._eventEmitterService.eventDeliverableModal.subscribe(item => {
      this.closeDeliverable()
      // this.pageChange(1)
    })
  }

  // getEventDetails(id){
  //   this._eventsService.getItem(id).subscribe(res=>{
  //     // this.getWorkflow();
  //     this._utilityService.detectChanges(this._cdr);
  //   })
  // }

  openHistoryPopup() {
    EventWorkflowStore.setCurrentPage(1);
    this._eventWorkflowService.getHistory(EventsStore.selectedEventId).subscribe(res => {
      this.workflowHistoryOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowHistory.nativeElement).modal('show');
    });
  }

  setPreviewFocus() {
		this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 999999);
		this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'auto');
	}


  closeHistoryPopup() {
    this.workflowHistoryOpened = false;
    $(this.workflowHistory.nativeElement).modal('hide');
  }

  openWorkflowPopup() {

    this._eventWorkflowService.getWorkflow(EventsStore.selectedEventId).subscribe(res => {
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
  validationStatusCheck()
  {
    this.scopeOfWorkValiation();
    if(EventsStore.eventDetails?.event_milestones?.length == 0){
      this.openValidation()
     }else if(EventsStore.eventDetails?.event_objectives?.length == 0 ){
       this.openValidation()
 
     }else if(!EventsStore.eventDetails?.owner){
       this.openValidation()
 
     }else if(EventsStore.eventDetails?.event_scopes.length == 0 || !this.scopeValidation || !this.exclusionScopeValidation || !this.assumptionScopeValidation){
       this.openValidation()
 
     }else if(DeliverableMasterStore?.allItems?.length == 0){
       this.openValidation()
 
     }else if(EventsStore.eventDetails?.event_tasks?.length == 0){
       this.openValidation()
 
     }else if(EventsStore?.eventDetails?.is_budgeted && EventsStore.eventDetails?.event_budgets?.length==0){
        this.openValidation()
     }else if (EventsStore?.eventOutcome?.length == 0){
       this.openValidation()
 
     }else if(EventsStore.eventDetails?.event_specifications.length == 0){
       this.openValidation()
 
     }else if(EventsStore.eventDetails?.event_stakeholders.length == 0){
      this.openValidation()
    }
    else if(EventsStore.eventDetails?.event_assistant_managers.length == 0){
      this.openValidation()
    }
    else if(EventsStore.eventDetails?.event_members.length == 0){
      this.openValidation()
    }
     else {
      this.submitEvent();
      SubMenuItemStore.submitClicked = true;
 
     }

  }

  openValidation(){
    this.validationPopupObject.type = 'Add';
    this.validationPopupObject.value = null;
    this.openValidationPopup()
  }

  openValidationPopup(){
    setTimeout(() => {
      $(this.validationCheck.nativeElement).modal('show');
    }, 100);
    this._renderer2.setStyle(this.validationCheck.nativeElement,'display','block');
    this._renderer2.setStyle(this.validationCheck.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.validationCheck.nativeElement,'z-index',99999);
  }

  closeValidationPopup(){
    setTimeout(() => {
      this.validationPopupObject.type = null;
      this.validationPopupObject.value = null;
      $(this.validationCheck.nativeElement).modal('hide');
      this._renderer2.removeClass(this.validationCheck.nativeElement,'show');
      this._renderer2.setStyle(this.validationCheck.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  scopeOfWorkValiation(){
    if(EventsStore.eventDetails?.event_scopes.length > 0){
      for(let data of EventsStore.eventDetails?.event_scopes){
        if(data.type == 'scope'){
          this.scopeValidation = true
        }
        if(data.type == 'exclusion'){
          this.exclusionScopeValidation = true
        }
        if(data.type == 'assumption'){
          this.assumptionScopeValidation = true
        }
      }
      
    }
  }

  submitEvent(){
    this.popupObject.type = 'Confirm';
    this.popupObject.title = 'submit';
    this.popupObject.subtitle = 'em_workflow_submit_message';
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 100);
    this._utilityService.detectChanges(this._cdr);
  }

   // modal control event
  modalControl(status: boolean) {
    //console.log(this.popupObject.title)
    switch (this.popupObject.title) {
      case 'submit': this.submitAccepted(status)
      case 'Outcome': this.removeExpectedOutcome(status)
        break;
    }
  }
   

  submitAccepted(status){
    //console.log(this.popupObject.title)
    if(status && this.popupObject.title=='submit'){
      this._eventWorkflowService.submitEvent(EventsStore.selectedEventId).subscribe(res=>{
        SubMenuItemStore.submitClicked = false;
        this.getIndividualEvent(EventsStore.selectedEventId)
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

   getIndividualEvent(id){
    this._eventService.getItem(id).subscribe(res=>{
      this.getWorkflow();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getWorkflow() {
    this._eventWorkflowService.getWorkflow(EventsStore.selectedEventId).subscribe(res=>{
      setTimeout(() => {
        this.setSubMenuItems()
      }, 250);
      
      this._utilityService.detectChanges(this._cdr);
    })
  }

setSubMenuItems() {
    if(EventsStore.eventDetails?.next_review_user_level==1&&EventsStore.eventDetails?.submitted_by==null){
      var subMenuItems =[]
       subMenuItems = [
        {activityName:'', submenuItem: {type: 'workflow',title : ''}},
        {activityName:'', submenuItem: {type: 'history',title : ''}},
        {activityName:'',submenuItem:{type:'submit',title : ''}},
      ]
      if(EventsStore?.eventDetails?.event_status?.type=='draft' || EventsStore?.eventDetails?.event_status?.type=='send-back')
      {
        subMenuItems.push({ activityName:'', submenuItem: { type: 'edit_modal',title : '' } })
      }
      subMenuItems.push( {activityName: null, submenuItem: {type: 'close', path: "../",title : ''}})
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);  
      this._utilityService.detectChanges(this._cdr);
    }   else if(EventsStore.eventDetails?.submitted_by!=null && EventsStore.eventDetails?.next_review_user_level && this.isUser()){
      if (EventsStore.eventDetails?.next_review_user_level == EventWorkflowStore?.workflowDetails[EventWorkflowStore?.workflowDetails?.length - 1]?.level){
        var subMenuItems =[]
         subMenuItems = [
          {activityName:'', submenuItem: {type: 'workflow',title : ''}},
          {activityName:'', submenuItem: {type: 'history',title : ''}},
          {activityName:'',submenuItem:{type:'approve',title : ''}},
          {activityName:'',submenuItem:{type:'revert',title:'Send Back'}},
          {activityName:'',submenuItem:{type:'reject',title:''}},

          {activityName:null, submenuItem: {type: 'close', path: '../',title : ''}}
        ]
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
        this._utilityService.detectChanges(this._cdr);
      }
      else if (EventsStore.eventDetails?.next_review_user_level != EventWorkflowStore?.workflowDetails[EventWorkflowStore?.workflowDetails?.length - 1]?.level){
        var subMenuItems=[];
         subMenuItems  = [
          {activityName:'', submenuItem: {type: 'workflow',title : ''}},
          {activityName:'', submenuItem: {type: 'history',title : ''}},
          {activityName:'',submenuItem:{type:'approve',title : ''}},
          {activityName:'',submenuItem:{type:'revert',title:'Send Back'}},
          {activityName:'',submenuItem:{type:'reject',title:''}},
          {activityName:null, submenuItem: {type: 'close', path: '../',title : ''}}
        ]
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
        this._utilityService.detectChanges(this._cdr);
      } 
      
    }else if (EventsStore.eventDetails?.next_review_user_level == null && EventsStore.eventDetails?.submitted_by!=null){
      var subMenuItems=[];
       subMenuItems  = [
        {activityName:'', submenuItem: {type: 'workflow',title : ''}},
        {activityName:'', submenuItem: {type: 'history',title : ''}},
        {activityName:null, submenuItem: {type: 'close', path: '../',title : ''}}
      ]
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
      this._utilityService.detectChanges(this._cdr);
    }
    
    else{
      var subMenuItems=[];
         subMenuItems = [
          {activityName:'', submenuItem: {type: 'workflow',title : ''}},
          {activityName:'', submenuItem: {type: 'history',title : ''}},
          // {activityName: '', submenuItem: {type: 'edit_modal',title : ''}},
        ]
        if(EventsStore?.eventDetails?.event_status?.type=='draft' || EventsStore?.eventDetails?.event_status?.type=='send-back')
        {
          subMenuItems.push({ activityName:'', submenuItem: { type: 'edit_modal',title : '' } })
        }
        subMenuItems.push( {activityName: null, submenuItem: {type: 'close', path: "../",title : ''}})
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
      }
}

  isUser() {
    if(EventsStore?.individualLoaded){
      for (let i of EventsStore?.eventDetails.workflow_items) {
        if (i.level == EventsStore?.eventDetails?.next_review_user_level) {
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

  getCreatedByPopupDetails(users, created?:string){
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name;
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation;
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id? users?.status_id:users?.status?.id;
    userDetial['created_at'] = created? created:null;
    return userDetial;
  }

  revertWorkflow() {
    EventWorkflowStore.type = 'revert';
    EventWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  
  rejectWorkflow() {
    EventWorkflowStore.type = 'reject';
    EventWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  approveWorkflow(type?) {
    if (type) {
      EventWorkflowStore.type = 'submit';
    }
    else
    EventWorkflowStore.type = 'approve';
   
    EventWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }
  
  closeCommentForm() {
    this.setSubMenuItems();
    EventWorkflowStore.type = '';
    EventWorkflowStore.commentForm = false;
    $(this.commentModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  
    this._utilityService.detectChanges(this._cdr)
  }

  // setSubMenu(){
  //   let subMenuItems = [
  //     {activityName: 'UPDATE_INCIDENT', submenuItem: {type: 'edit_modal'}},
  //     {activityName:null, submenuItem: {type: 'close', path: '/event-monitoring/events'}}
  //   ]
  //   this._helperService.checkSubMenuItemPermissions(3800, subMenuItems);
  // }

  openExpectedOutcomeModel() {
		this.outcomeObject.type = 'Add';
		this._utilityService.detectChanges(this._cdr)
		setTimeout(() => {
			$(this.addEventOutcome.nativeElement).modal('show');
		}, 250);
	}

  getOutcomes(newPage: number = null) {
    if (newPage) EventsStore.setOutcomesCurrentPage(newPage);
    this._eventService.getOutcome(EventsStore.selectedEventId).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  deleteOutcomes(id) {
		this.popupObject.id = id;
		this.popupObject.title = 'Outcome';
		this.popupObject.type = '';
		this.popupObject.subtitle = "delete_outcome"
		setTimeout(() => {
			$(this.confirmationPopUp.nativeElement).modal('show');
		}, 250);
	}

  removeExpectedOutcome(status){
   // console.log(status)
    if(status && this.popupObject.id && this.popupObject.title=='Outcome'){
      this._eventService.deleteOutcome(this.popupObject.id).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
        this.clearDeleteObject();
      })
    }
    else
    {
      this.clearDeleteObject();
    }
    setTimeout(() => {
			$(this.confirmationPopUp.nativeElement).modal('hide');
		}, 250);
  }

  clearDeleteObject(){
    this.popupObject.id = null;
    this.popupObject.title="";
    this._utilityService.detectChanges(this._cdr);
  }

  changeZIndex() {
		if ($(this.addEventOutcome.nativeElement).hasClass('show')) {
			this._renderer2.setStyle(this.addEventOutcome.nativeElement, 'z-index', 99999);
			this._renderer2.setStyle(this.addEventOutcome.nativeElement, 'overflow', 'scroll');
		}
	}

  closeAddOutcome() {
		this.outcomeObject.type = null
		$(this.addEventOutcome.nativeElement).modal('hide');
		setTimeout(() => {
			this._utilityService.detectChanges(this._cdr);
		}, 250);
	}

  createPreviewUrl(type, token) {
    return this._eventFileService.getThumbnailPreview(type, token)
  }


  // Returns image url according to type and token
  createImageUrl(type, token) {
    if (type == 'document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    else
      return this._eventFileService.getThumbnailPreview(type, token);
  }

  
// extension check function
checkExtension(ext, extType) {
  return this._imageService.checkFileExtensions(ext, extType)
}

viewBrochureItem(type, documents, documentFile) {

  switch (type) {
    case "document-version":
      this._documentFileService
        .getFilePreview(type, documents.document_id, documentFile.id)
        .subscribe((res) => {
          var resp: any = this._utilityService.getDownLoadLink(
            res,
            documents.title
          );
          this.openPreviewModal(type, resp, documentFile, documents);
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

    case 'event-file':
      this._eventFileService.getFilePreview('event-file', documents.event_id, documentFile).subscribe(res => {
        var resp: any = this._utilityService.getDownLoadLink(res, documents.title);
        this.openPreviewModal(type, resp, documents, documentFile);
      }), (error => {
        if (error.status == 403) {
          this._utilityService.showErrorMessage('error', 'permission_denied');
        }
        else {
          this.openPreviewModal(type, null, documents, documentFile);
        }
      });
      break;

    default:
      break;
  }


}

downloadDocumentFile(type, document, docs?) {
  event.stopPropagation();
  switch (type) {
    case "event-file":
      this._eventFileService.downloadFile(
        type,
        document.event_id,
        document.id,
        null,
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

  openPreviewModal(type, filePreview, documentFiles, document) {
    this.previewObject.component=type;

    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.componentId = documentFiles.incident_id;
      
      this.previewObject.uploaded_user = EventsStore.eventDetails.created_by;
      this.previewObject.created_at = document.created_at;
      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }

  // openNewOutcome(){
  //   setTimeout(() => {
  //     $(this.addEventOutcome.nativeElement).modal('show');
  //   }, 100);
  // }

  openNewOutcome() {
		
		this._utilityService.detectChanges(this._cdr)
		setTimeout(() => {
			$(this.addEventOutcome.nativeElement).modal('show');
		}, 250);
	}

  editOutcomes(value){

    event.stopPropagation();
    this.outcomeObject.type = 'Edit';
    this.outcomeObject.values = value;
    setTimeout(()=>{
      this.openNewOutcome()
    },500)    
    this._utilityService.detectChanges(this._cdr);
     

  }

  closePreviewModal(event) {
    $(this.filePreviewModal.nativeElement).modal("hide");
    this.previewObject.preview_url = "";
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = "";
    this.previewObject.file_details = null;
    this.previewObject.componentId = null;
  }
  getNoDataSource(type){
    let noDataSource = {
      noData: this.emptyMessage, border: false, imageAlign: type
    }
    return noDataSource;
  }

  openNewDeliverableModal(){
    this.deliverableObject.type = 'Add';
    this.deliverableObject.values = null; // for clearing the value
    this.openNewDeliverable()

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

  edit(value){
    event.stopPropagation();
      this.deliverableObject.type = 'Edit';
      this.deliverableObject.values = value;
      this.openNewDeliverable()
      this._utilityService.detectChanges(this._cdr);
      this.deliverableObject.values = value;  
    }

    getDeliverables(){
      this._deliverableService.getItems().subscribe(res => {
        this.Loaded = true      
        this._utilityService.detectChanges(this._cdr)
      })
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
      if (status && this.popupObject.id &&  this.popupObject.title=='delete_deliverable') {
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


  

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    //SubMenuItemStore.unSetClickedSubMenuItem();
    this.addOutcomeSubscription.unsubscribe();
    //this.confirmationSubscription.unsubscribe();
    this.popupControlEventSubscription.unsubscribe()
    this.eventWorkflowHistorySubscription.unsubscribe();
    this.eventWorkflowSubscription.unsubscribe();
    // this.eventWorkflowCommentSubscription.unsubscribe();
  }

}
