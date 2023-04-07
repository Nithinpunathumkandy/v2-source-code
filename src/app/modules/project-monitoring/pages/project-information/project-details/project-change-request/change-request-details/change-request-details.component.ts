import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild , OnDestroy} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ProjectChangeRequestService } from 'src/app/core/services/project-monitoring/project-change-request/project-change-request.service';
import { ProjectChangeRequestWorkflowService } from 'src/app/core/services/project-monitoring/project-monitoring/project-change-request-workflow-service/project-change-request-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ProjectChangeRequestStore } from 'src/app/stores/project-monitoring/project-change-request-store';
import { ProjectChangeRequestWorkflowStore } from 'src/app/stores/project-monitoring/project-change-request-workflow.store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { ProjectTeamStore } from 'src/app/stores/project-monitoring/project-team-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;

@Component({
  selector: 'app-change-request-details',
  templateUrl: './change-request-details.component.html',
  styleUrls: ['./change-request-details.component.scss']
})
export class ChangeRequestDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;
  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('addChangeReq', {static: true}) addChangeReq: ElementRef;



  ProjectChangeRequestStore = ProjectChangeRequestStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  ProjectMonitoringStore = ProjectMonitoringStore;
  ProjectTeamStore = ProjectTeamStore
  ProjectChangeRequestWorkflowStore = ProjectChangeRequestWorkflowStore
  reactionDisposer: IReactionDisposer;
  AppStore = AppStore
  selectedItem: any;
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
  }
  workflowHistoryOpened: boolean = false;
  workflowModalOpened: boolean = false;
  popupControlEventSubscription: any;
  projectChangeRequstWorkFlowSubsscription: any;
  projectChangeRequstWorkFlowHistorySubsscription: any;
  projectChangeRequstCommentSubscription: any;
  changeReqSubscriptionEvent: any;
  constructor(    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _utilityService: UtilityService,
    private _activatedRouter: ActivatedRoute,
    private _helperService: HelperServiceService,
    private _changeRequestService: ProjectChangeRequestService,
    private _imageService:ImageServiceService,
    private __projectChaneRequestWorkflowService : ProjectChangeRequestWorkflowService,
    private _eventEmitterService: EventEmitterService,
    private _route: Router,) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    this.reactionDisposer = autorun(() => {

      // if(ProjectChangeRequestStore.individualChangeRequestItem && ProjectChangeRequestStore.individualLoaded && ProjectChangeRequestWorkflowStore.workflowDetails && AuthStore.userPermissionsLoaded){
      //   this.setSubMenuItems();
      // } 
      // this._helperService.checkSubMenuItemPermissions(600,subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
             this.editProjectChangeRequest(ProjectChangeRequestStore.selectedId);
            break;
            case "delete":
              this.delete()
              break;
            case 'submit':
               this.submitProjectChangeRequestForReview();
               SubMenuItemStore.submitClicked = true;
              break
            case 'approve':
                this.approveWorkflow();
              break
            case 'review_submit':
                   this.approveWorkflow(true);
                break
            case 'revert':
                  this.revertWorkflow();
                break;
                case 'reject':
                   this.rejectWorkflow();
                break
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
    });
    let id: number;
    let projectId : number;
    this._activatedRouter.params.subscribe(params => {
      id = +params['requestId']; 
      projectId = +params['id']
      ProjectMonitoringStore.setSelectedProjectId(projectId)
      ProjectChangeRequestStore.selectedId = id;
     this.getInividualItemDetails(id);
     
    });

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.projectChangeRequstCommentSubscription = this._eventEmitterService.projectChangeRequestCommentModal.subscribe(item => {
      this.closeCommentForm()
      this.getInividualItemDetails(ProjectChangeRequestStore.selectedId);
    })

    this.projectChangeRequstWorkFlowSubsscription = this._eventEmitterService.projectChangeRequestWorkflowModal.subscribe(item => {
      this.closeWorkflowPopup()
      this.getInividualItemDetails(ProjectChangeRequestStore.selectedId);
    })
    this.projectChangeRequstWorkFlowHistorySubsscription = this._eventEmitterService.projectChangeRequestWorkflowHistoryModal.subscribe(item => {
      this.closeHistoryPopup()
      this.getInividualItemDetails(ProjectChangeRequestStore.selectedId);
    })
    this.changeReqSubscriptionEvent = this._eventEmitterService.projectChangeRequestItemsModal.subscribe(item => {
      this.closeChangeRequestModal()
    })
  }

  checkBudgetOrNonbudget(){
    if(ProjectMonitoringStore.individualDetails?.project_type.is_budgeted == 0 && ProjectChangeRequestStore.individualChangeRequestItem){
      let pos =  ProjectChangeRequestStore.individualChangeRequestItem?.change_request_items.findIndex(e=> e.type =='budget')
      if(pos != -1){
        ProjectChangeRequestStore.individualChangeRequestItem?.change_request_items.splice(pos,1)
      }
     }
    this._utilityService.detectChanges(this._cdr);
  }

  
  getWorkflow(id) {
    this.__projectChaneRequestWorkflowService.getItems(id).subscribe(res=>{
      this.setSubMenuItems();
      this._utilityService.detectChanges(this._cdr);
    })
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

  getNewAmountTotal(){
    let amount = 0
    if(ProjectChangeRequestStore.individualChangeRequestItem?.budgets.length > 0){
      for(let data of ProjectChangeRequestStore.individualChangeRequestItem?.budgets){
        if(data.type != 'deleted'){
          amount = amount + Number(data.new_amount)
        }
      }
    }
    return amount
  }

  getExistingTotal(){
    let amount = 0
   if(ProjectChangeRequestStore.individualChangeRequestItem?.budgets.length > 0){
     for(let data of ProjectChangeRequestStore.individualChangeRequestItem?.budgets){
       amount = amount + Number(data.existing_amount)
     }
   }
   return amount
  }

  selectReqItems(pos,id){
    console.log("id",id)
    this.selectedItem = id
    this.selectedItemPos = pos;
  }

  getInividualItemDetails(id){
   this._changeRequestService.getIndividualItem(id).subscribe(res=>{
     this.getWorkflow(id)
     this.checkBudgetOrNonbudget()
    this._utilityService.detectChanges(this._cdr);
    
   })
  }

   //passing token to get preview
   createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  editProjectChangeRequest(id){
    this._changeRequestService.getIndividualItem(id).subscribe(res=>{
      this.changeRequestObject.value = res
      this.changeRequestObject.type = 'Edit'
      this.changeRequestModal()
      this._utilityService.detectChanges(this._cdr);
    })
  }

  changeRequestModal(){
    // this._renderer2.addClass(this.addChangeReq.nativeElement,'show');
    setTimeout(() => {
      $(this.addChangeReq.nativeElement).modal('show');
    }, 100);
    this._renderer2.setStyle(this.addChangeReq.nativeElement,'display','block');
    this._renderer2.setStyle(this.addChangeReq.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.addChangeReq.nativeElement,'z-index',99999);
  }

  closeChangeRequestModal(){
    setTimeout(() => {
      // $(this.newProject.nativeElement).modal('hide');
      this.changeRequestObject.type = null;
      this.changeRequestObject.value = null;
      this._renderer2.removeClass(this.addChangeReq.nativeElement,'show');
      this._renderer2.setStyle(this.addChangeReq.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  //returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }  

  setSubMenuItems() {
      if(ProjectChangeRequestStore.individualChangeRequestItem.next_review_user_level==1&&ProjectChangeRequestStore.individualChangeRequestItem.submitted_by==null){
        var subMenuItems = [
          {activityName:'LIST_PROJECT_CHANGE_REQUEST_WORKFLOW', submenuItem: {type: 'workflow',title : ''}},
          {activityName:'LIST_PROJECT_CHANGE_REQUEST_WORKFLOW_HISTORY', submenuItem: {type: 'history',title : ''}},
          {activityName:'SUBMIT_PROJECT_CHANGE_REQUEST',submenuItem:{type:'submit',title : ''}},
          { activityName:'UPDATE_PROJECT_MONITOR_CHANGE_REQUEST', submenuItem: { type: 'edit_modal',title : '' } },
          {activityName: 'DELETE_PROJECT_MONITOR_CHANGE_REQUEST', submenuItem: {type: 'delete',title:''}},

          {activityName: null, submenuItem: {type: 'close', path:'/project-monitoring/projects/'+ProjectMonitoringStore.selectedProjectId+'/change-request',title : ''}},
        ]
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);  
         
        this._utilityService.detectChanges(this._cdr);
      }   else if(ProjectChangeRequestStore.individualChangeRequestItem.submitted_by!=null && ProjectChangeRequestStore.individualChangeRequestItem.next_review_user_level && this.isUser()){
        if (ProjectChangeRequestStore.individualChangeRequestItem.next_review_user_level == ProjectChangeRequestWorkflowStore?.workflowDetails[ProjectChangeRequestWorkflowStore?.workflowDetails?.length - 1]?.level){
          var subMenuItems = [
            {activityName:'LIST_PROJECT_CHANGE_REQUEST_WORKFLOW', submenuItem: {type: 'workflow',title : ''}},
            {activityName:'LIST_PROJECT_CHANGE_REQUEST_WORKFLOW_HISTORY', submenuItem: {type: 'history',title : ''}},
            {activityName:'APPROVE_PROJECT_CHANGE_REQUEST',submenuItem:{type:'approve',title : ''}},
            {activityName:'REVERT_PROJECT_CHANGE_REQUEST',submenuItem:{type:'revert',title:'Send Back'}},
            {activityName:'REJECT_PROJECT_CHANGE_REQUEST',submenuItem:{type:'reject',title:''}},

            // {activityName:'UPDATE_BUSINESS_IMPACT_ANALYSIS_RESULT', submenuItem: {type: 'edit_modal',title : ''}},
            {activityName:null, submenuItem: {type: 'close', path:'/project-monitoring/projects/'+ProjectMonitoringStore.selectedProjectId+'/change-request',title : ''}}
          ]
          this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
          this._utilityService.detectChanges(this._cdr);
        }
        else if (ProjectChangeRequestStore.individualChangeRequestItem.next_review_user_level != ProjectChangeRequestWorkflowStore?.workflowDetails[ProjectChangeRequestWorkflowStore?.workflowDetails?.length - 1]?.level){
          var subMenuItems  = [
            {activityName:'LIST_PROJECT_CHANGE_REQUEST_WORKFLOW', submenuItem: {type: 'workflow',title : ''}},
            {activityName:'LIST_PROJECT_CHANGE_REQUEST_WORKFLOW_HISTORY', submenuItem: {type: 'history',title : ''}},
            {activityName:'SUBMIT_PROJECT',submenuItem:{type:'review_submit',title : ''}},
            {activityName:'REVERT_PROJECT',submenuItem:{type:'revert',title:'Send Back'}},
            {activityName:'REVERT_PROJECT',submenuItem:{type:'reject',title:''}},

            // {activityName:'UPDATE_BUSINESS_IMPACT_ANALYSIS_RESULT', submenuItem: {type: 'edit_modal',title : ''}},
            {activityName:null, submenuItem: {type: 'close', path:'/project-monitoring/projects/'+ProjectMonitoringStore.selectedProjectId+'/change-request',title : ''}}
          ]
          this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
          this._utilityService.detectChanges(this._cdr);
        } 
        
      }else if (ProjectChangeRequestStore.individualChangeRequestItem.next_review_user_level == null && ProjectChangeRequestStore.individualChangeRequestItem.submitted_by!=null){
        var subMenuItems  = [
          {activityName:'LIST_PROJECT_WORKFLOW', submenuItem: {type: 'workflow',title : ''}},
          {activityName:'LIST_PROJECT_WORKFLOW_HISTORY', submenuItem: {type: 'history',title : ''}},
          // {activityName:'SUBMIT_PROJECT',submenuItem:{type:'review_submit',title : ''}},
          // {activityName:'REVERT_PROJECT',submenuItem:{type:'revert',title:'Send Back'}},
          // {activityName:'REVERT_PROJECT',submenuItem:{type:'reject',title:''}},

          // {activityName:'UPDATE_BUSINESS_IMPACT_ANALYSIS_RESULT', submenuItem: {type: 'edit_modal',title : ''}},
          {activityName:null, submenuItem: {type: 'close', path:'/project-monitoring/projects/'+ProjectMonitoringStore.selectedProjectId+'/change-request',title : ''}}
        ]
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
        this._utilityService.detectChanges(this._cdr);
      }
      
      else{
          var subMenuItems = [
            {activityName:'LIST_PROJECT_WORKFLOW', submenuItem: {type: 'workflow',title : ''}},
            {activityName:'LIST_PROJECT_WORKFLOW_HISTORY', submenuItem: {type: 'history',title : ''}},
            {activityName: 'UPDATE_PROJECT_MONITOR_CHANGE_REQUEST', submenuItem: {type: 'edit_modal',title : ''}},
            {activityName: 'DELETE_PROJECT_MONITOR_CHANGE_REQUEST', submenuItem: {type: 'delete',title:''}},
            {activityName:null, submenuItem: {type: 'close', path:'/project-monitoring/projects/'+ProjectMonitoringStore.selectedProjectId+'/change-request',title : ''}}
          ]
          this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
        }
  }

  isUser() {
    if(ProjectChangeRequestStore?.individualLoaded){
      for (let i of ProjectChangeRequestStore?.individualChangeRequestItem.workflow_items) {
        if (i.level == ProjectChangeRequestStore?.individualChangeRequestItem?.next_review_user_level) {
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

  submitProjectChangeRequestForReview(){
    this.popupObject.type = 'Confirm';
    this.popupObject.title = 'submit';
    this.popupObject.subtitle = 'Are you sure you want to submit this change request?';
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 100);
    this._utilityService.detectChanges(this._cdr);
  }

  delete() {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = ProjectChangeRequestStore.selectedId;
    this.popupObject.title = 'delete';
    this.popupObject.subtitle = 'It will remove the project change request from the project';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

     // modal control event
modalControl(status: boolean) {
  switch (this.popupObject.title) {
      case 'submit': this.submitAccepted(status)
      break;
      case 'delete': this.deleteCR(status)
      break; 
  }
}


// delete function call
deleteCR(status: boolean) {
  if (status && this.popupObject.id) {
    this._changeRequestService.deleteChangeRequestItem(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this._route.navigateByUrl('/project-monitoring/change-request');
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

submitAccepted(status){
  if(status){
    this.__projectChaneRequestWorkflowService.submitProject(ProjectChangeRequestStore.selectedId).subscribe(res=>{
      SubMenuItemStore.submitClicked = false;
      this.getInividualItemDetails(ProjectChangeRequestStore.selectedId)
      this._utilityService.detectChanges(this._cdr);
    },(error)=>{
      SubMenuItemStore.submitClicked = false;
    }
    )
  }else{
    SubMenuItemStore.submitClicked = false;
  }
  setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('hide');
  }, 250);
 }

 clearPopupObject() {
  this.popupObject.id = null;
}

 openHistoryPopup() {
  ProjectChangeRequestWorkflowStore.setCurrentPage(1);
  this.__projectChaneRequestWorkflowService.getHistory(ProjectChangeRequestStore.selectedId).subscribe(res => {
    this.workflowHistoryOpened = true;
    this._utilityService.detectChanges(this._cdr);
    $(this.workflowHistory.nativeElement).modal('show');
  });
}

closeHistoryPopup() {
  this.workflowHistoryOpened = false;
  $(this.workflowHistory.nativeElement).modal('hide');
}

revertWorkflow() {
  ProjectChangeRequestWorkflowStore.type = 'revert';
  ProjectChangeRequestWorkflowStore.commentForm = true;
  $(this.commentModal.nativeElement).modal('show');
  this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
  this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
  this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
}


rejectWorkflow() {
  ProjectChangeRequestWorkflowStore.type = 'reject';
  ProjectChangeRequestWorkflowStore.commentForm = true;
  $(this.commentModal.nativeElement).modal('show');
  this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
  this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
  this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
}

approveWorkflow(type?) {
  if (type) {
    ProjectChangeRequestWorkflowStore.type = 'submit';
  }
  else
  ProjectChangeRequestWorkflowStore.type = 'approve';
  ProjectChangeRequestWorkflowStore.commentForm = true;
  $(this.commentModal.nativeElement).modal('show');
  this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
  this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
  this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
}

closeCommentForm() {
  this.setSubMenuItems();
  ProjectChangeRequestWorkflowStore.type = '';
  ProjectChangeRequestWorkflowStore.commentForm = false;
  $(this.commentModal.nativeElement).modal('hide');
  this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
  this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
  this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
  $('.modal-backdrop').remove();

  this._utilityService.detectChanges(this._cdr)
}

openWorkflowPopup() {
  this.__projectChaneRequestWorkflowService.getItems(ProjectChangeRequestStore.selectedId).subscribe(res => {
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

selectDaysDiffrence(){
  if(ProjectMonitoringStore.individualDetails?.start_date && ProjectChangeRequestStore.individualChangeRequestItem?.durations?.start_date){
    let startDate : any = ProjectMonitoringStore.individualDetails?.start_date;
    let endDate : any   =  ProjectChangeRequestStore.individualChangeRequestItem?.durations?.start_date;
    
    const diffInMs   = Number(new Date(endDate)) - Number(new Date(startDate))
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
     return diffInDays
  }

}

selectEndDaysDiffrence(){
  if(ProjectMonitoringStore.individualDetails?.target_date && ProjectChangeRequestStore.individualChangeRequestItem?.durations?.end_date){
    let startDate : any = ProjectMonitoringStore.individualDetails?.target_date;
    let endDate : any   =  ProjectChangeRequestStore.individualChangeRequestItem?.durations?.end_date;
    
    const diffInMs   = Number(new Date(endDate)) - Number(new Date(startDate))
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
     return diffInDays
  }

}

labelDot(data) {
  if (data) {
  let str = data;
  let color="";
  const myArr = str.split("-");
  color=myArr[0];
  return color;
  }
}

ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupControlEventSubscription.unsubscribe()
    this.projectChangeRequstCommentSubscription.unsubscribe()
    this.projectChangeRequstWorkFlowSubsscription.unsubscribe()
    this.projectChangeRequstWorkFlowHistorySubsscription.unsubscribe()
    this.changeReqSubscriptionEvent.unsubscribe()
    ProjectChangeRequestStore.individualLoaded = false

  }

}
