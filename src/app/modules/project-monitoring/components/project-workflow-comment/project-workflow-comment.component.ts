import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectWorkflowService } from 'src/app/core/services/project-monitoring/project-workflow/project-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { ProjectWorkflowStore } from 'src/app/stores/project-monitoring/project-workflow.store';

@Component({
  selector: 'app-project-workflow-comment',
  templateUrl: './project-workflow-comment.component.html',
  styleUrls: ['./project-workflow-comment.component.scss']
})
export class ProjectWorkflowCommentComponent implements OnInit {
 
  ProjectMonitoringStore = ProjectMonitoringStore;
  ProjectWorkflowStore = ProjectWorkflowStore;
  AppStore = AppStore
  title: string;
  comments: string
  formErrors: any;
  levelArray=[];
  level:number;
  comementObj = [{
    id : 1,
    title : 'Project Information',
    commets : null,
    checked : false
  },
  {
    id : 2,
    title : 'Project Milestone',
    commets : null,
    checked : false
  },
  {
    id : 3,
    title : 'Strategic Alignment',
    commets : null,
    checked : false
  },
  {
    id : 4,
    title : 'Project Team',
    commets : null,
    checked : false
  },
  {
    id : 5,
    title : 'Scope Of Work',
    commets : null,
    checked : false
  },
  {
    id : 6,
    title : 'Risk Management',
    commets : null,
    checked : false
  },
  {
    id : 7,
    title : 'Stakeholder',
    commets : null,
    checked : false
  },
  {
    id : 8,
    title : 'Budget & Payment',
    commets : null,
    checked : false
  },
  {
    id : 9,
    title : 'Documents',
    commets : null,
    checked : false
  },
  {
    id : 10,
    title : 'Issues/ Challenges',
    commets : null,
    checked : false

  },
  
]
  isNotValid: boolean = false;
  body: string = '';

  constructor(private _helperService: HelperServiceService,
    private _eventEmitterService:EventEmitterService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _projectWorkflowService : ProjectWorkflowService) { }

  ngOnInit(): void {
    this.setTitle()
    this.setLevel()
  }
  setTitle() {
  if(ProjectWorkflowStore.type == 'revert'){
    this.title =  'Send back'
    this.body = 'You can select changes required areas along with the comments and send them back to the user'

  }else if (ProjectWorkflowStore.type == 'submit'){
    this.title =  'Approve'; 
    this.body = 'Approval describes gaining the customers or contractees acceptance at the end of a project by successfully delivering goods and services that meet the requirements that were set at the beginning of the project'

  }else if(ProjectWorkflowStore.type == 'reject'){
    this.body= 'Project rejection is  failed to receive that approval.'
    this.title =  ProjectWorkflowStore.type; 
  }
  else {
    this.title =  ProjectWorkflowStore.type; 
    this.body = 'Approval describes gaining the customers or contractees acceptance at the end of a project by successfully delivering goods and services that meet the requirements that were set at the beginning of the project'

  }
  }

  setLevel(){
    this.levelArray=[];
    this.levelArray.push(0);
      for(let i of ProjectMonitoringStore?.individualDetails?.workflow_items){
        if(i.level<ProjectMonitoringStore?.individualDetails?.next_review_user_level)
        this.levelArray.push(i.level);
      }
  }

  getButtonText(text) {
    // * Checking for Last Level and Setting Button Text as Publish 
    // * If not Last Level Setting Button Text as the Selected Type (Approve | Reject | Revert)

    // if (documentWorkFlowStore.nextReviewUserLevel == documentWorkFlowStore.finalReviewUserLevel && text =='approve')
    //   return this._helperService.translateToUserLanguage('publish');
    // else
    return this._helperService.translateToUserLanguage(text);
  }

  processData(){
    let comments = []
    for(let data of this.comementObj){
      if(data.checked){
        let obj = {
          title : data.title,
          review_comment : data.commets ? data.commets : ''
        }
        comments.push(obj)
      }
    }
    return comments
  }

  validationCheck(){
    let valid = false
    for(let data of this.comementObj){
      if(data.checked){
        valid = true;
        break;
      }
    }
    return valid
  }

  save(close: boolean = false) {

    let save;
    AppStore.enableLoading();

    let comment = {
      comment: this.comments
    }

    switch (ProjectWorkflowStore.type) {

      case 'approve':
        let comment = {
          comment: this.comments,
          // status_title : ProjectWorkflowStore.type
        }
        save = this._projectWorkflowService.approveProject(ProjectMonitoringStore.selectedProjectId,comment);
        break;
        case 'submit':
          let submitComment = {
            comment: this.comments,
            // status_title : ProjectWorkflowStore.type

          }
          save = this._projectWorkflowService.approveProject(ProjectMonitoringStore.selectedProjectId,submitComment);
          break;

      case 'revert':
        let data = {
          comments: this.processData(),
          status_title : ProjectWorkflowStore.type,
          revert_to_level:this.level
        }
        save = this._projectWorkflowService.revertProject(ProjectMonitoringStore.selectedProjectId,data);
        break;

        case 'reject':
        let rejectdata = {
          comments: this.processData(),
          status_title : ProjectWorkflowStore.type,
          // revert_to_level:this.level
        }
        save = this._projectWorkflowService.rejectProject(ProjectMonitoringStore.selectedProjectId,rejectdata);
        break;

      default:
        break;
    }

    save.subscribe(
      (res: any) => {
        this._utilityService.detectChanges(this._cdr);
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      },
      (err: HttpErrorResponse) => {
        // AppStore.disableLoading();
        //   this._utilityService.showErrorMessage(
        //     "Error!",
        //     "Something went wrong. Please try again."
        //   );
        // this._utilityService.detectChanges(this._cdr);
        AppStore.disableLoading();
        if (err.status == 422) {
          this.formErrors = err.error;
          // this.processFormErrors()
        } else {
          this._utilityService.showErrorMessage(
            "Error!",
            "Something went wrong. Please try again."
          );
          this._utilityService.detectChanges(this._cdr);
        }
      }
    );

  }

  cancel() {
    this.closeFormModal();
  }

  closeFormModal() {
    AppStore.disableLoading();
    this.level=null;
    this.comments = null;
    this._eventEmitterService.dismissPlanMeasureMainCommentModal()
  }

  ngOnDestroy() {
    this.level=null;
    this.formErrors = null;
    this.comments = null;
  }
}
