import { string } from '@amcharts/amcharts4/core';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectMilestoneService } from 'src/app/core/services/project-monitoring/project-milestone.service';
import { ProjectMonitoringService } from 'src/app/core/services/project-monitoring/project-monitoring/project-monitoring.service';
import { ProjectWorkflowService } from 'src/app/core/services/project-monitoring/project-workflow/project-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ProjectMilestoneStore } from 'src/app/stores/project-monitoring/project-milestone-store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { StakeholderStore } from 'src/app/stores/project-monitoring/project-stakeholder-store';
import { ProjectWorkflowStore } from 'src/app/stores/project-monitoring/project-workflow.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

declare var $: any;

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss']
})
export class ProjectInfoComponent implements OnInit, OnDestroy {
  @ViewChild('newProject', {static: true}) newProject: ElementRef;
  @ViewChild('outComes', {static: true}) outComes: ElementRef;
  @ViewChild('deliverables', {static: true}) deliverables: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;
  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('newStakeholder', {static: true}) newStakeholder: ElementRef;
  @ViewChild('newProgress', {static: true}) newProgress: ElementRef;
  @ViewChild('validationCheck', {static: true}) validationCheck: ElementRef;
  @ViewChild('outCome', {static: true}) outCome: ElementRef
  @ViewChild('preview', {static: true}) preview: ElementRef;






  reactionDisposer: IReactionDisposer;
  ProjectMonitoringStore = ProjectMonitoringStore;
  ProjectWorkflowStore = ProjectWorkflowStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore
  StakeholderStore = StakeholderStore;
  AuthStore = AuthStore
  AppStore = AppStore
  ProjectMilestoneStore = ProjectMilestoneStore;
  workflowHistoryOpened=false;
  workflowModalOpened: boolean=false;
  newProjectObject = {
    id : null,
    type : null,
    value : null
  }

  newDeliverablessObject = {
    id : null,
    type : null,
    value : null
  }
 
  newOutComesObject = {
    id : null,
    type : null,
    value : null
  }
  newStakeholderObject = {
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
  validationPopupObject = {
    type : null,
    id : null,
    value : null,
  }
  no_of_milestone : number = 0;

  projectInformationEventSubscrion: any;
  projectOutcomesEventSubscrion: any;
  projectDeliverablesEventSubscrion: any;
  popupControlEventSubscription: any;
  projectWorkflowHistorySubscription: any;
  projectWorkflowSubscription: any;
  projectWorkflowCommentSubscription: any;
  stakeholderSubscriptionEvent: any = null;
  noDataSourceOutcome = {
    noData: "No outcomes added", border: false
  }
  noDataSourceDeli = {
    noData: "No deliverables added", border: false
  }
  noDataSourceStakeholder = {
    noData: "No stakeholders added", border: false
  }
  validationCheckEventSubscription: any;
  is_scopeValidation: boolean = false;
  out_scopeValidation: boolean = false;
  assumption_scopeValidation: boolean =false;
  constructor(private _renderer2: Renderer2,
              private _utilityService: UtilityService,
              private _cdr: ChangeDetectorRef,
              private _projectWorkflowService : ProjectWorkflowService,
              private _helperService : HelperServiceService, 
              private _projectService : ProjectMonitoringService,
              private _eventEmitterService: EventEmitterService,
              private _projectMilestoneService : ProjectMilestoneService,
              private _route: Router,) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => { 
    
      // if(ProjectMonitoringStore.individualDetails && ProjectMonitoringStore.individualLoaded && ProjectWorkflowStore.workflowDetails && AuthStore.userPermissionsLoaded){
      //   this.setSubMenuItems();
      // }     
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
             this.editProjectInformation(ProjectMonitoringStore.selectedProjectId);
            break;
            case "delete":
              this.deleteProject()
              break;
            case 'submit':
              this.validationStatusCheck();
              
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
    // this.getIndividualProfileInformation(ProjectMonitoringStore.selectedProjectId)
 
    // SubMenuItemStore.setSubMenuItems([
    //   { type: "edit_modal" },
    //   {type: "close", path: "../"}
    // ]);

    this.projectInformationEventSubscrion = this._eventEmitterService.projectInformationAddModalControl.subscribe(item => {
      this.closeNewProject()
      this.getIndividualProfileInformation(ProjectMonitoringStore.selectedProjectId)

    })
    this.projectOutcomesEventSubscrion = this._eventEmitterService.projectOutcomesModal.subscribe(item => {
      this.closeNewOutcomes()
      this.getOutcomes()
    })

    this.projectDeliverablesEventSubscrion = this._eventEmitterService.projectDeliverablesModal.subscribe(item => {
      this.closeNewDeliverables()
      this.getDeliverables()
    })

    this.validationCheckEventSubscription = this._eventEmitterService.projectmonitoriingValidationModal.subscribe(item => {
      this.closeValidationPopup()
    })

    this.stakeholderSubscriptionEvent = this._eventEmitterService.projectStakeholderModal.subscribe(item => {
      this.closeNewStakeholder();
      this.getIndividualProfileInformation(ProjectMonitoringStore.selectedProjectId)
      this.getStakeholder()
    })

  
    this.projectWorkflowHistorySubscription = this._eventEmitterService.ProjectMonitorHistory.subscribe(element=>{
      this.closeHistoryPopup();
    })

    this.projectWorkflowSubscription = this._eventEmitterService.planMeasureMainComment.subscribe(element=>{
      this.closeCommentForm();
      this.getIndividualProfileInformation(ProjectMonitoringStore.selectedProjectId)
    })

    this.projectWorkflowCommentSubscription = this._eventEmitterService.planMeasureMainHistory.subscribe(element=>{
      this.closeWorkflowPopup();
    })

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.getOutcomes();
    this.getIndividualProfileInformation(ProjectMonitoringStore.selectedProjectId)
     this.getDeliverables();
     this.getStakeholder();
     this.getMileStoneList()
  }

  getIndividualProfileInformation(id){
    this._projectService.getItem(id).subscribe(res=>{
      if(res.project_type?.is_budgeted == 1){
        ProjectMonitoringStore.isBudgeted = true
      }else {
        ProjectMonitoringStore.isBudgeted = false
      }
      this.getWorkflow()
      this.scopeOfWorkValiation()
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getWorkflow() {
    this._projectWorkflowService.getItems(ProjectMonitoringStore.selectedProjectId).subscribe(res=>{
      this.setSubMenuItems()
      this._utilityService.detectChanges(this._cdr);
    })
  }


  setSubMenuItems() {
      if(ProjectMonitoringStore.individualDetails.next_review_user_level==1&&ProjectMonitoringStore.individualDetails.submitted_by==null){
        var subMenuItems = [
          {activityName:'LIST_PROJECT_WORKFLOW', submenuItem: {type: 'workflow',title : ''}},
          {activityName:'LIST_PROJECT_WORKFLOW_HISTORY', submenuItem: {type: 'history',title : ''}},
          {activityName:'SUBMIT_PROJECT',submenuItem:{type:'submit',title : ''}},
          { activityName:'UPDATE_PROJECT_CHARTER', submenuItem: { type: 'edit_modal',title : '' } },
          {activityName: 'DELETE_PROJECT_CHARTER', submenuItem: {type: 'delete',title:''}},
          {activityName: null, submenuItem: {type: 'close', path: "../",title : ''}},
        ]
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);  
         
        this._utilityService.detectChanges(this._cdr);
      }   else if(ProjectMonitoringStore.individualDetails.submitted_by!=null && ProjectMonitoringStore.individualDetails.next_review_user_level && this.isUser()){
        if (ProjectMonitoringStore.individualDetails?.next_review_user_level == ProjectWorkflowStore?.workflowDetails[ProjectWorkflowStore?.workflowDetails?.length - 1]?.level){
          var subMenuItems = [
            {activityName:'LIST_PROJECT_WORKFLOW', submenuItem: {type: 'workflow',title : ''}},
            {activityName:'LIST_PROJECT_WORKFLOW_HISTORY', submenuItem: {type: 'history',title : ''}},
            {activityName:'APPROVE_PROJECT',submenuItem:{type:'approve',title : ''}},
            {activityName:'REVERT_PROJECT',submenuItem:{type:'revert',title:'Send Back'}},
            {activityName:'REVERT_PROJECT',submenuItem:{type:'reject',title:''}},

            {activityName:null, submenuItem: {type: 'close', path: '../',title : ''}}
          ]
          this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
          this._utilityService.detectChanges(this._cdr);
        }
        else if (ProjectMonitoringStore.individualDetails.next_review_user_level != ProjectWorkflowStore?.workflowDetails[ProjectWorkflowStore?.workflowDetails?.length - 1]?.level){
          var subMenuItems  = [
            {activityName:'LIST_PROJECT_WORKFLOW', submenuItem: {type: 'workflow',title : ''}},
            {activityName:'LIST_PROJECT_WORKFLOW_HISTORY', submenuItem: {type: 'history',title : ''}},
            {activityName:'SUBMIT_PROJECT',submenuItem:{type:'review_submit',title : 'Approve'}},
            {activityName:'REVERT_PROJECT',submenuItem:{type:'revert',title:'Send Back'}},
            {activityName:'REVERT_PROJECT',submenuItem:{type:'reject',title:''}},
            {activityName:null, submenuItem: {type: 'close', path: '../',title : ''}}
          ]
          this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
          this._utilityService.detectChanges(this._cdr);
        } 
        
      }else if (ProjectMonitoringStore.individualDetails.next_review_user_level == null && ProjectMonitoringStore.individualDetails.submitted_by!=null){
        var subMenuItems  = [
          {activityName:'LIST_PROJECT_WORKFLOW', submenuItem: {type: 'workflow',title : ''}},
          {activityName:'LIST_PROJECT_WORKFLOW_HISTORY', submenuItem: {type: 'history',title : ''}},
          {activityName:null, submenuItem: {type: 'close', path: '../',title : ''}}
        ]
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
        this._utilityService.detectChanges(this._cdr);
      }
      
      else{
          var subMenuItems = [
            {activityName:'LIST_PROJECT_WORKFLOW', submenuItem: {type: 'workflow',title : ''}},
            {activityName:'LIST_PROJECT_WORKFLOW_HISTORY', submenuItem: {type: 'history',title : ''}},
            {activityName: 'UPDATE_PROJECT_CHARTER', submenuItem: {type: 'edit_modal',title : ''}},
            {activityName: 'DELETE_PROJECT_CHARTER', submenuItem: {type: 'delete',title:''}},
            {activityName:null, submenuItem: {type: 'close', path: '../',title : ''}}
          ]
          this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
        }
  }

  openHistoryPopup() {
    ProjectWorkflowStore.setCurrentPage(1);
    this._projectWorkflowService.getHistory(ProjectMonitoringStore.selectedProjectId).subscribe(res => {
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
    ProjectWorkflowStore.type = 'revert';
    ProjectWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  
  rejectWorkflow() {
    ProjectWorkflowStore.type = 'reject';
    ProjectWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  approveWorkflow(type?) {
    if (type) {
      ProjectWorkflowStore.type = 'submit';
    }
    else
    ProjectWorkflowStore.type = 'approve';
    ProjectWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }
  
  closeCommentForm() {
    this.setSubMenuItems();
    ProjectWorkflowStore.type = '';
    ProjectWorkflowStore.commentForm = false;
    $(this.commentModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  
    this._utilityService.detectChanges(this._cdr)
  }

  openWorkflowPopup() {
    this._projectWorkflowService.getItems(ProjectMonitoringStore.selectedProjectId).subscribe(res => {
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

  isUser() {
    if(ProjectMonitoringStore?.individualLoaded){
      for (let i of ProjectMonitoringStore?.individualDetails.workflow_items) {
        if (i.level == ProjectMonitoringStore?.individualDetails?.next_review_user_level) {
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


  editProjectInformation(id){
    event.stopPropagation();
    this._projectService.getItem(id).subscribe(res=>{
      this.newProjectObject.type = 'Edit';
      this.newProjectObject.value = res;
      this.openNewProject()
      this._utilityService.detectChanges(this._cdr);
    })
  }

  openNewProject(){
    setTimeout(() => {
      $(this.newProject.nativeElement).modal('show');
    }, 100);
    this._renderer2.setStyle(this.newProject.nativeElement,'display','block');
    this._renderer2.setStyle(this.newProject.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.newProject.nativeElement,'z-index',99999);
  }

  closeNewProject(){
    setTimeout(() => {
      this.newProjectObject.type = null;
      this.newProjectObject.value = null;
      $(this.newProject.nativeElement).modal('hide');
      this._renderer2.removeClass(this.newProject.nativeElement,'show');
      this._renderer2.setStyle(this.newProject.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  // outcomes modal
  addNewOutcomes(){
    this.newOutComesObject.type = 'Add';
    this.openNewOutcomes();
  }

  openNewOutcomes(){
    setTimeout(() => {
      $(this.outComes.nativeElement).modal('show');
    }, 100);
    this._renderer2.setStyle(this.outComes.nativeElement,'display','block');
    this._renderer2.setStyle(this.outComes.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.outComes.nativeElement,'z-index',99999);
  }


  closeNewOutcomes(){
 
    setTimeout(() => {
      this.newOutComesObject.type = null;
      this.newOutComesObject.value = null;
      $(this.outComes.nativeElement).modal('hide');
      this._renderer2.removeClass(this.outComes.nativeElement,'show');
      this._renderer2.setStyle(this.outComes.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  getOutcomes(){
    this._projectService.getOutcomes().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  editOutcome(data){
    this.newOutComesObject.type =  "Edit"
    this.newOutComesObject.value = data
    this.openNewOutcomes()

  }

  // preview modal
  


// deliverables modal
  addNewDeliverables(){
    this.newDeliverablessObject.type = 'Add';
    this.openNewDeliverables();
  }

  openNewDeliverables(){
    setTimeout(() => {
      $(this.deliverables.nativeElement).modal('show');
    }, 100);
    this._renderer2.setStyle(this.deliverables.nativeElement,'display','block');
    this._renderer2.setStyle(this.deliverables.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.deliverables.nativeElement,'z-index',99999);
  }

  closeNewDeliverables(){
 
    setTimeout(() => {
      this.newDeliverablessObject.type = null;
      this.newDeliverablessObject.value = null;
      $(this.deliverables.nativeElement).modal('hide');
      this._renderer2.removeClass(this.deliverables.nativeElement,'show');
      this._renderer2.setStyle(this.deliverables.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  getDeliverables(){
    this._projectService.getDeliverables().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  editDeliverable(data){
    this.newDeliverablessObject.type =  "Edit"
    this.newDeliverablessObject.value = data
    this.openNewDeliverables()

  }


  openNewStakeholderModal(){
    this.newStakeholderObject.type = 'Add';
    this.newStakeholderObject.value = null
    this.openNewStakeholder()

  }

  openNewStakeholder(){
    setTimeout(() => {
      $(this.newStakeholder.nativeElement).modal('show');
    }, 100);
    this._renderer2.addClass(this.newStakeholder.nativeElement,'show');
    this._renderer2.setStyle(this.newStakeholder.nativeElement,'display','block');
    this._renderer2.setStyle(this.newStakeholder.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.newStakeholder.nativeElement,'z-index',99999);
  }

  closeNewStakeholder(){
 
    setTimeout(() => {
      this.newStakeholderObject.type = null;
      this.newStakeholderObject.value = null;
      $(this.newStakeholder.nativeElement).modal('hide');
      this._renderer2.removeClass(this.newStakeholder.nativeElement,'show');
      this._renderer2.setStyle(this.newStakeholder.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  getStakeholder() {
   this._projectService.getStakeholder().subscribe(res=>{
    this._utilityService.detectChanges(this._cdr);
   })
	}

  editStakeholder(value){
    event.stopPropagation();
      this.newStakeholderObject.type = 'Edit';
      this.newStakeholderObject.value = value;
      this.openNewStakeholder()
      this._utilityService.detectChanges(this._cdr);
    }

    submitProjectForReview(){
      this.popupObject.type = 'Confirm';
      this.popupObject.title = 'submit';
      this.popupObject.subtitle = 'pm_workfolw_submit_message';
      setTimeout(() => {
        $(this.confirmationPopUp.nativeElement).modal('show');
      }, 100);
      this._utilityService.detectChanges(this._cdr);
  
    }

    deleteProject() {
      event.stopPropagation();
      this.popupObject.type = '';
      this.popupObject.id = ProjectMonitoringStore.selectedProjectId;
      this.popupObject.title = 'delete-project';
      this.popupObject.subtitle = 'delete_projects_subtitle';
      this._utilityService.detectChanges(this._cdr);
      $(this.confirmationPopUp.nativeElement).modal('show');
  
    }
  

  // for delete
  deleteStakeholders(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'are_you_sure';
    this.popupObject.id = id;
    this.popupObject.title = 'stakeholder';
    this.popupObject.subtitle = 'delete_stakeholders_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }
  // for delete
  deleteDeliverables(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'are_you_sure';
    this.popupObject.id = id;
    this.popupObject.title = 'deliverable';
    this.popupObject.subtitle = 'delete_deliverable_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }
    // for delete
    deleteOutcomes(id: number) {
      event.stopPropagation();
      this.popupObject.type = 'are_you_sure';
      this.popupObject.id = id;
      this.popupObject.title = 'outcomes';
      this.popupObject.subtitle = 'delete_outcome_subtitle';
      this._utilityService.detectChanges(this._cdr);
      $(this.confirmationPopUp.nativeElement).modal('show');
  
    }

      // for popup object clearing
clearPopupObject() {
  this.popupObject.id = null;
}

   // modal control event
modalControl(status: boolean) {
switch (this.popupObject.title) {
  case 'outcomes': this.deleteOutcome(status)
    break;
  case 'deliverable': this.deleteDeliverable(status)
    break; 
  case 'stakeholder': this.deleteStakeholder(status)
    break; 
    case 'submit': this.submitAccepted(status)
    break;
    case 'delete-project': this.deleteProjects(status)
    break;  
}

}

 // delete function call
 deleteProjects(status: boolean) {
  if (status && this.popupObject.id) {
    this._projectService.delete(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this._route.navigateByUrl('/project-monitoring/projects');
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

scroll(){
  $('html, body').animate({
    scrollTop:  document.getElementById('outCome')
}, 500);
return false;
}

submitAccepted(status){
  if(status){
    this._projectWorkflowService.submitProject(ProjectMonitoringStore.selectedProjectId).subscribe(res=>{
      SubMenuItemStore.submitClicked = false;
      this.getIndividualProfileInformation(ProjectMonitoringStore.selectedProjectId)
      this._utilityService.detectChanges(this._cdr);
    },
    (error)=>{
      SubMenuItemStore.submitClicked = false;
    })
    
  }else{
    SubMenuItemStore.submitClicked = false;
  }
  setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('hide');
  }, 250);
 }

// delete deliverable function call
deleteDeliverable(status: boolean) {
  if (status && this.popupObject.id) {
    this._projectService.deleteDeliverable(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.getDeliverables();
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

// delete expected outcome function call
deleteOutcome(status: boolean) {
  if (status && this.popupObject.id) {
    this._projectService.deleteOutcome(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.getOutcomes();
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

// delete stakeholder function call
deleteStakeholder(status: boolean) {
  if (status && this.popupObject.id) {
    this._projectService.deleteStakeholder(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.getStakeholder();
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


getMileStoneProgress(){
  let milestone = 0
  if(ProjectMonitoringStore.individualDetails?.milestone_progress){
   milestone = ProjectMonitoringStore.individualDetails?.milestone_progress
  }
  return milestone
}

getMileStoneList(){
  this.no_of_milestone = 0;
  this._projectMilestoneService.getMilestons().subscribe(res=>{
    this.completedMilestone()
    this._utilityService.detectChanges(this._cdr);
  })
}

completedMilestone(){
  if(ProjectMilestoneStore.milesstones.length> 0){
  for(let value of ProjectMilestoneStore.milesstones){
    if(value.completion == "100.00"){
      this.no_of_milestone = this.no_of_milestone + 1;

    }
  }
}
}

  validationStatusCheck(){
    this.scopeOfWorkValiation()
    if(ProjectMonitoringStore.individualDetails?.project_milestones?.length == 0){
     this.openValidation()
    }else if(ProjectMonitoringStore.individualDetails?.project_strategic_alignments?.length == 0 ){
      this.openValidation()

    }else if(!ProjectMonitoringStore.individualDetails?.project_manager){
      this.openValidation()

    }else if(ProjectMonitoringStore.individualDetails?.project_scopes.length == 0 || !this.is_scopeValidation || !this.out_scopeValidation || !this.assumption_scopeValidation){
      this.openValidation()

    }else if(ProjectMonitoringStore.individualDetails?.project_risks?.length == 0){
      this.openValidation()

    }else if(StakeholderStore.allItems?.length == 0){
      this.openValidation()

    }else if((ProjectMonitoringStore.individualDetails?.project_budgets?.length == 0 || ProjectMonitoringStore.individualDetails?.project_payments?.length == 0) && ProjectMonitoringStore.individualDetails?.project_type?.is_budgeted == 1){
      this.openValidation()

    }else if (ProjectMonitoringStore.expectedOutcomes.length == 0){
      this.openValidation()

    }else if(ProjectMonitoringStore.deliverables.length == 0){
      this.openValidation()

    }else {
     this.submitProjectForReview();
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
    if(ProjectMonitoringStore.individualDetails?.project_scopes.length > 0){
      for(let data of ProjectMonitoringStore.individualDetails?.project_scopes){
        if(data.type == 'in_scope'){
          this.is_scopeValidation = true
        }
        if(data.type == 'out_scope'){
          this.out_scopeValidation = true
        }
        if(data.type == 'assumption'){
          this.assumption_scopeValidation = true
        }
      }
      
    }
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.projectInformationEventSubscrion.unsubscribe();
    this.projectDeliverablesEventSubscrion.unsubscribe();
    this.stakeholderSubscriptionEvent.unsubscribe();
    this.projectOutcomesEventSubscrion.unsubscribe()
    this.projectWorkflowHistorySubscription.unsubscribe();
    this.projectWorkflowSubscription.unsubscribe();
    this.projectWorkflowCommentSubscription.unsubscribe();
    this.validationCheckEventSubscription.unsubscribe();
    this.popupControlEventSubscription.unsubscribe()

  }
}
