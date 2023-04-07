import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IReactionDisposer, autorun } from "mobx";
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ProjectClosureWorkflowService } from 'src/app/core/services/project-monitoring/project-closure-workflow/project-closure-workflow.service';
import { ProjectClosureService } from 'src/app/core/services/project-monitoring/project-closure/project-closure.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ProjectClosureStore } from 'src/app/stores/project-monitoring/project-closure';
import { ProjectClosureWorkflowStore } from 'src/app/stores/project-monitoring/project-closure-workflow.store';
import { ProjectIssueStore } from 'src/app/stores/project-monitoring/project-issue-store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $:any

@Component({
  selector: 'app-project-closure-details',
  templateUrl: './project-closure-details.component.html'
})
export class ProjectClosureDetailsComponent implements OnInit, OnDestroy {

  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('addProjectClosure', {static: true}) addProjectClosure: ElementRef;

  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  ProjectIssueStore = ProjectIssueStore;
  ProjectClosureStore = ProjectClosureStore;
  ProjectClosureWorkflowStore = ProjectClosureWorkflowStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  modalEventSubscription:any;

  remainingDaysAre: number = 0;
  todayDate: any = new Date();

  workflowHistoryOpened=false;
  workflowModalOpened: boolean=false;
  biaWorkflowHistorySubscription: any;
  biaWorkflowSubscription: any;
  biaCommentSubscription: any;
  popupControlEventSubscription: any;
  projectClosureSubscriptionEvent: any = null;

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  ProjectClosureObject = {
    id : null,
    type : null,
    value : null
  }

  constructor(
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _activatedRouter: ActivatedRoute,
    private _helperService: HelperServiceService,
    private _imageService:ImageServiceService,
    private _projectClosureService: ProjectClosureService,
    private _eventEmitterService: EventEmitterService,
    private _projectClosureWorkflowService: ProjectClosureWorkflowService,
    private _renderer2: Renderer2,private _route: Router,
  ) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof ProjectClosureDetailsComponent
   */
  ngOnInit(): void {
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    let id: number;
    this._activatedRouter.params.subscribe(params => {
      id = +params['id']; 
      ProjectClosureStore.selectedId = id;
     this.getProjectIssueDetails(id);
     
    });

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    this.reactionDisposer = autorun(() => {
      AppStore.showDiscussion = false;
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal": 
          this.editProjectClosure(ProjectClosureStore.selectedId);
            break;
            case "delete":
              this.delete()
              break;
            case 'submit':
              this.submitProjectClosureForReview();
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
                break
              case 'reject':
                  this.rejectWorkflow();
                 break
            case "history": 
            this.openHistoryPopup();
                break;
            case "workflow": 
            this.openWorkflowPopup()
                break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    this.projectClosureSubscriptionEvent = this._eventEmitterService.projectClosureModal.subscribe(item => {
      this.closeProjectClosureModal()
      this.getProjectIssueDetails(ProjectClosureStore.selectedId); 
    })

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.biaWorkflowSubscription = this._eventEmitterService.projectClosureWorkflow.subscribe(element=>{
      this.closeWorkflowPopup();
    })

    this.biaWorkflowHistorySubscription = this._eventEmitterService.projectClosureHistory.subscribe(element=>{
      this.closeHistoryPopup();
    })

    this.biaCommentSubscription = this._eventEmitterService.projectClosureCommentModal.subscribe(element=>{
      this.closeCommentForm();
    })
  }

  getWorkflow() {
    this._projectClosureWorkflowService.getItems(ProjectClosureStore.selectedId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getProjectIssueDetails(id){
    this.getWorkflow()
    this._projectClosureService.getItem(ProjectMonitoringStore.selectedProjectId,id).subscribe(res=>{
      if(res?.next_review_user_level==1&&res?.submitted_by==null){
        var subMenuItems = [
          {activityName:'LIST_PROJECT_MONITOR_CLOSURE_WORKFLOW', submenuItem: {type: 'workflow' ,title : ''}},
          {activityName:'LIST_PROJECT_MONITOR_CLOSURE_WORKFLOW_HISTORY', submenuItem: {type: 'history' ,title : ''}},
          {activityName:'SUBMIT_PROJECT_MONITOR_CLOSURE',submenuItem:{type:'submit' ,title : ''}},
          { activityName:'UPDATE_PROJECT_MONITOR_CLOSURE', submenuItem: { type: 'edit_modal' ,title : ''} },
          {activityName: 'DELETE_PROJECT_MONITOR_CHANGE_REQUEST', submenuItem: {type: 'delete',title:''}},
          {activityName: null, submenuItem: {type: 'close', path: "/project-monitoring/project-closures" ,title : ''}},
        ]
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);   
        this._utilityService.detectChanges(this._cdr);
      }   else if(res?.submitted_by!=null && res?.next_review_user_level && this.isUser()){
        if (res?.next_review_user_level == ProjectClosureWorkflowStore?.workflowDetails[ProjectClosureWorkflowStore?.workflowDetails?.length - 1]?.level){
          var subMenuItems = [
            {activityName:'LIST_PROJECT_MONITOR_CLOSURE_WORKFLOW', submenuItem: {type: 'workflow' ,title : ''}},
            {activityName:'LIST_PROJECT_MONITOR_CLOSURE_WORKFLOW_HISTORY', submenuItem: {type: 'history' ,title : ''}},
            {activityName:'APPROVE_PROJECT_MONITOR_CLOSURE',submenuItem:{type:'approve' ,title : ''}},
            {activityName:'REVERT_PROJECT_MONITOR_CLOSURE',submenuItem:{type:'revert' ,title : 'Send Back'}},
            {activityName:'REVERT_PROJECT',submenuItem:{type:'reject' ,title : ''}},
            // {activityName:'UPDATE_PROJECT_MONITOR_CLOSURE', submenuItem: {type: 'edit_modal' ,title : ''}},
            // {activityName: 'DELETE_PROJECT_MONITOR_CHANGE_REQUEST', submenuItem: {type: 'delete',title:''}},
            {activityName:null, submenuItem: {type: 'close', path: "/project-monitoring/project-closures" ,title : ''}}
          ]
          this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
          this._utilityService.detectChanges(this._cdr);
        }
        else if (res?.next_review_user_level != ProjectClosureWorkflowStore?.workflowDetails[ProjectClosureWorkflowStore?.workflowDetails?.length - 1]?.level){
          var subMenuItems = [
            {activityName:'LIST_PROJECT_MONITOR_CLOSURE_WORKFLOW', submenuItem: {type: 'workflow' ,title : ''}},
            {activityName:'LIST_PROJECT_MONITOR_CLOSURE_WORKFLOW_HISTORY', submenuItem: {type: 'history' ,title : ''}},
            {activityName:'SUBMIT_PROJECT_MONITOR_CLOSURE',submenuItem:{type:'review_submit' ,title : ''}},
            {activityName:'REVERT_PROJECT_MONITOR_CLOSURE',submenuItem:{type:'revert' ,title : 'Send Back'}},
            {activityName:'REVERT_PROJECT',submenuItem:{type:'reject' ,title : ''}},
            // {activityName:'UPDATE_PROJECT_MONITOR_CLOSURE', submenuItem: {type: 'edit_modal' ,title : ''}},
            {activityName:null, submenuItem: {type: 'close', path: "/project-monitoring/project-closures" ,title : ''}}
          ]
          this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
          this._utilityService.detectChanges(this._cdr);
        }
      }else{
          var subMenuItems = [
            {activityName:'LIST_PROJECT_MONITOR_CLOSURE_WORKFLOW', submenuItem: {type: 'workflow' ,title : ''}},
            {activityName:'LIST_PROJECT_MONITOR_CLOSURE_WORKFLOW_HISTORY', submenuItem: {type: 'history' ,title : ''}},
            {activityName: 'UPDATE_PROJECT_MONITOR_CLOSURE', submenuItem: {type: 'edit_modal' ,title : ''}},
            {activityName: 'DELETE_PROJECT_MONITOR_CHANGE_REQUEST', submenuItem: {type: 'delete',title:''}},
            {activityName:null, submenuItem: {type: 'close', path: "/project-monitoring/project-closures" ,title : ''}}
          ]
          this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
        }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  isUser() {
    if(ProjectClosureStore?.individualLoaded){
      for (let i of ProjectClosureStore?.indivitualProjectClosure?.workflow_items) {
        if (i.level == ProjectClosureStore?.indivitualProjectClosure?.next_review_user_level) {
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

  openWorkflowPopup() {
    this._projectClosureWorkflowService.getItems(ProjectClosureStore.selectedId).subscribe(res => {
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
  openHistoryPopup() {
    ProjectClosureWorkflowStore.setCurrentPage(1);
    this._projectClosureWorkflowService.getHistory(ProjectClosureStore.selectedId).subscribe(res => {
      this.workflowHistoryOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowHistory.nativeElement).modal('show');
    });
  }

  closeHistoryPopup() {
    this.workflowHistoryOpened = false;
    $(this.workflowHistory.nativeElement).modal('hide');
  }

  delete() {
    event.stopPropagation();
    this.popupObject.type = 'are_you_sure';
    this.popupObject.id = ProjectClosureStore.selectedId
    this.popupObject.title = 'delete';
    this.popupObject.subtitle = 'It will remove the project closure  from the project';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  submitProjectClosureForReview(){
    this.popupObject.type = 'Confirm';
    this.popupObject.title = 'submit';
    this.popupObject.subtitle = 'pm_submit_project_closure?';
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 100);
    this._utilityService.detectChanges(this._cdr);

  }

  submitAccepted(status){
    if(status){
      this._projectClosureWorkflowService.submitProjectClosure(ProjectClosureStore?.selectedId).subscribe(res=>{
        SubMenuItemStore.submitClicked = false;
        this.getProjectIssueDetails(ProjectClosureStore?.selectedId)
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

   modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case 'Confirm': this.submitAccepted(status)
        break;
        case 'are_you_sure': this.deleteClosure(status)
        break; 
    }
    
  }
  
  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
}

   // delete function call
   deleteClosure(status: boolean) {
    if (status && this.popupObject.id) {
      this._projectClosureService.delete(ProjectMonitoringStore.selectedProjectId,this.popupObject.id).subscribe(resp => {
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

  
  
  approveWorkflow(type?) {
    if (type) {
      ProjectClosureWorkflowStore.type = 'submit';
    }
    else
    ProjectClosureWorkflowStore.type = 'approve';
    ProjectClosureWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }
  
  closeCommentForm() {
    this.getProjectIssueDetails(ProjectClosureStore.selectedId);
    ProjectClosureWorkflowStore.type = '';
    ProjectClosureWorkflowStore.commentForm = false;
    $(this.commentModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  
    this._utilityService.detectChanges(this._cdr)
  }
  
  revertWorkflow() {
    ProjectClosureWorkflowStore.type = 'revert';
    ProjectClosureWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  rejectWorkflow() {
    ProjectClosureWorkflowStore.type = 'reject';
    ProjectClosureWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  getDaysRemaining() {
    let startDate = new Date(ProjectClosureStore?.indivitualProjectClosure?.project?.target_date);
    this.remainingDaysAre = Math.floor((startDate.getTime() - this.todayDate.getTime()) / 1000 / 60 / 60 / 24);
    if (this.remainingDaysAre >= 0)
      this.remainingDaysAre = this.remainingDaysAre + 1;
    else
      this.remainingDaysAre = 0;
    return this.remainingDaysAre;
  }

  assignUserValues(user) {
    if (user) {
      var userInfoObject = {
        first_name: '',
        last_name: '',
        designation: '',
        image_token: '',
        mobile: null,
        email: '',
        id: null,
        department: '',
        status_id: null
      }

      userInfoObject.first_name = user?.first_name;
      userInfoObject.last_name = user?.last_name;
      userInfoObject.designation = user?.designation;
      userInfoObject.image_token = user?.image.token;
      userInfoObject.email = user?.email;
      userInfoObject.mobile = user?.mobile;
      userInfoObject.id = user?.id;
      userInfoObject.status_id = user?.status.id
      userInfoObject.department = user?.department;
      return userInfoObject;
    }
  }


   createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  openProjectClosure(){
    this._renderer2.addClass(this.addProjectClosure.nativeElement,'show');
    this._renderer2.setStyle(this.addProjectClosure.nativeElement,'display','block');
    this._renderer2.setStyle(this.addProjectClosure.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.addProjectClosure.nativeElement,'z-index',99999);
  }

  closeProjectClosureModal(){
    setTimeout(() => {
      // $(this.newProject.nativeElement).modal('hide');
      this.ProjectClosureObject.type = null;
      this.ProjectClosureObject.value = null;
      this._renderer2.removeClass(this.addProjectClosure.nativeElement,'show');
      this._renderer2.setStyle(this.addProjectClosure.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  editProjectClosure(id){
    event.stopPropagation();
    this._projectClosureService.getItem(ProjectMonitoringStore.selectedProjectId,id).subscribe(res=>{
      if(res){
        this.ProjectClosureObject.value = res;
        this.ProjectClosureObject.type = 'Edit';
        this._utilityService.detectChanges(this._cdr);
        this.openProjectClosure()
      }
    })
    }

    labelDot(data) {
      if (data)  {
        let str = data;
        let color="";
        const myArr = str.split("-");
        color=myArr[0];
        return color;
      }
    }
   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof ProjectClosureDetailsComponent
   */
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    ProjectIssueStore?.unsetIndivitualProjectIssue();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.biaWorkflowHistorySubscription.unsubscribe();
    this.biaWorkflowSubscription.unsubscribe();
    this.biaCommentSubscription.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    this.projectClosureSubscriptionEvent.unsubscribe();
  }

}
