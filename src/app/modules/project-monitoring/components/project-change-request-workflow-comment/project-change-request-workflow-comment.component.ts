import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ProjectClosureWorkflowService } from 'src/app/core/services/project-monitoring/project-closure-workflow/project-closure-workflow.service';
import { ProjectClosureWorkflowStore } from 'src/app/stores/project-monitoring/project-closure-workflow.store';
import { ProjectClosureStore } from 'src/app/stores/project-monitoring/project-closure';
import { ProjectChangeRequestWorkflowService } from 'src/app/core/services/project-monitoring/project-monitoring/project-change-request-workflow-service/project-change-request-workflow.service';
import { ProjectChangeRequestStore } from 'src/app/stores/project-monitoring/project-change-request-store';
import { ProjectChangeRequestWorkflowStore } from 'src/app/stores/project-monitoring/project-change-request-workflow.store';
@Component({
  selector: 'app-project-change-request-workflow-comment',
  templateUrl: './project-change-request-workflow-comment.component.html',
  styleUrls: ['./project-change-request-workflow-comment.component.scss']
})
export class ProjectChangeRequestWorkflowCommentComponent implements OnInit {
  AppStore = AppStore;
  ProjectClosureWorkflowStore = ProjectClosureWorkflowStore;
  ProjectChangeRequestWorkflowStore = ProjectChangeRequestWorkflowStore
  ProjectClosureStore = ProjectClosureStore;
  title: string;
  comments: string
  formErrors: any;
  levelArray=[];
  level:number;

  constructor(private _helperService: HelperServiceService,
    private _eventEmitterService:EventEmitterService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _projectChangeRequestWorkflowService : ProjectChangeRequestWorkflowService) { }

  ngOnInit(): void {
    this.setTitle()
    this.setLevel()
  }

  setTitle() {

    this.title = ProjectChangeRequestWorkflowStore.type;
  }

  setLevel(){
    this.levelArray=[];
    this.levelArray.push(0);
      for(let i of ProjectClosureStore?.indivitualProjectClosure?.workflow_items){
        if(i.level<ProjectClosureStore.indivitualProjectClosure?.next_review_user_level)
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


  save(close: boolean = false) {

    let save;
    AppStore.enableLoading();

    let comment = {
      comment: this.comments
    }

    switch (ProjectChangeRequestWorkflowStore.type) {

      case 'approve':
        let comment = {
          comment: this.comments
        }
        save = this._projectChangeRequestWorkflowService.approveProject(ProjectChangeRequestStore.selectedId,comment);
        break;
        case 'submit':
          let submitComment = {
            comment: this.comments
          }
          save = this._projectChangeRequestWorkflowService.approveProject(ProjectChangeRequestStore.selectedId,submitComment);
          break;

      case 'revert':
        let data = {
          comment: this.comments,
          revert_to_level:this.level
        }
        save = this._projectChangeRequestWorkflowService.revertProject(ProjectChangeRequestStore.selectedId,data);
        break;

        case 'reject':
          let rejectData = {
            comment: this.comments,
            revert_to_level:this.level
          }
          save = this._projectChangeRequestWorkflowService.rejectProject(ProjectChangeRequestStore.selectedId,rejectData);
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
          this.formErrors = err.error.errors;
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
    this._eventEmitterService.dismissProjectChangeRequestCommentModal()
  }

  ngOnDestroy() {
    this.level=null;
    this.formErrors = null;
    this.comments = null;
  }

}
