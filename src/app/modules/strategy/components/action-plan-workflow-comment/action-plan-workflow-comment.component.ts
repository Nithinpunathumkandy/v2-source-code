import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ProjectClosureWorkflowStore } from 'src/app/stores/project-monitoring/project-closure-workflow.store';
import { ProjectClosureStore } from 'src/app/stores/project-monitoring/project-closure';
import { ObjectiveWorkflowService } from 'src/app/core/services/strategy-management/objective-workflow-service/objective-workflow.service';
import { ObjectiveWorkflowStore } from 'src/app/stores/strategy-management/objective-workflow.store';
import { ActionPlansService } from 'src/app/core/services/strategy-management/action-plans/action-plans.service';
import { ActionPlanWorkflowService } from 'src/app/core/services/strategy-management/action-plan-workflow/action-plan-workflow.service';
import { ActionPlanWorkflowStore } from 'src/app/stores/strategy-management/action-plan-workflow.store';
@Component({
  selector: 'app-action-plan-workflow-comment',
  templateUrl: './action-plan-workflow-comment.component.html',
  styleUrls: ['./action-plan-workflow-comment.component.scss']
})
export class ActionPlanWorkflowCommentComponent implements OnInit {

 
  AppStore = AppStore;
  ActionPlanWorkflowStore = ActionPlanWorkflowStore
  title: string;
  comments: string
  formErrors: any;
  levelArray=[];
  level:number;

  constructor(private _helperService: HelperServiceService,
    private _eventEmitterService:EventEmitterService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _actionPlanWorkflowService : ActionPlanWorkflowService) { }

  ngOnInit(): void {
    this.setTitle()
    // this.setLevel()
  }

  setTitle() {

    this.title = ActionPlanWorkflowStore.type;
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

    switch (ActionPlanWorkflowStore.type) {

      case 'approve':
        let comment = {
          comment: this.comments
        }
        save = this._actionPlanWorkflowService.approveProject(ActionPlanWorkflowStore.selectedId,comment);
        break;
        case 'submit':
          let submitComment = {
            comment: this.comments
          }
          save = this._actionPlanWorkflowService.approveProject(ActionPlanWorkflowStore.selectedId,submitComment);
          break;

      case 'revert':
        let data = {
          comment: this.comments,
          revert_to_level:this.level
        }
        save = this._actionPlanWorkflowService.revertProject(ActionPlanWorkflowStore.selectedId,data);
        break;

        case 'reject':
          let rejectData = {
            comment: this.comments,
            revert_to_level:this.level
          }
          save = this._actionPlanWorkflowService.rejectProject(ActionPlanWorkflowStore.selectedId,rejectData);
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
    this._eventEmitterService.dismissActionPlanReviewCommentModal()
  }

  ngOnDestroy() {
    this.level=null;
    this.formErrors = null;
    this.comments = null;
  }

}
