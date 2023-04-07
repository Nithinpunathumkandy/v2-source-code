import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ProjectClosureWorkflowService } from 'src/app/core/services/project-monitoring/project-closure-workflow/project-closure-workflow.service';
import { ProjectClosureWorkflowStore } from 'src/app/stores/project-monitoring/project-closure-workflow.store';
import { ProjectClosureStore } from 'src/app/stores/project-monitoring/project-closure';

@Component({
  selector: 'app-project-closure-workflow-comment',
  templateUrl: './project-closure-workflow-comment.component.html'
})
export class ProjectClosureWorkflowCommentComponent implements OnInit {

  AppStore = AppStore;
  ProjectClosureWorkflowStore = ProjectClosureWorkflowStore;
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
    private _projectClosureWorkflowService:ProjectClosureWorkflowService,)
     { }

  ngOnInit(): void {
    this.setTitle()
    this.setLevel()
  }

  setTitle() {

    this.title = ProjectClosureWorkflowStore.type;
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

    switch (ProjectClosureWorkflowStore.type) {

      case 'approve':
        let comment = {
          comment: this.comments
        }
        save = this._projectClosureWorkflowService.approveProjectClosure(ProjectClosureStore.selectedId,comment);
        break;
        case 'submit':
          let submitComment = {
            comment: this.comments
          }
          save = this._projectClosureWorkflowService.approveProjectClosure(ProjectClosureStore.selectedId,submitComment);
          break;

      case 'revert':
        let data = {
          comment: this.comments,
          revert_to_level:this.level
        }
        save = this._projectClosureWorkflowService.revertProjectClosure(ProjectClosureStore.selectedId,data);
        break;

        case 'reject':
          let rejectData = {
            comment: this.comments,
            revert_to_level:this.level
          }
          save = this._projectClosureWorkflowService.rejectProjectClosure(ProjectClosureStore.selectedId,rejectData);
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
    this._eventEmitterService.dismissProjectClosureCommentModal()
  }

  ngOnDestroy() {
    this.level=null;
    this.formErrors = null;
    this.comments = null;
  }

}
