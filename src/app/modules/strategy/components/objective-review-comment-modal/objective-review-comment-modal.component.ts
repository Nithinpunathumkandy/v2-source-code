import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ProjectClosureWorkflowStore } from 'src/app/stores/project-monitoring/project-closure-workflow.store';
import { ProjectClosureStore } from 'src/app/stores/project-monitoring/project-closure';
import { ProjectChangeRequestStore } from 'src/app/stores/project-monitoring/project-change-request-store';
import { ObjectiveScoreStore } from 'src/app/stores/strategy-management/objective-score.store';
import { ObjectiveWorkflowService } from 'src/app/core/services/strategy-management/objective-workflow-service/objective-workflow.service';
import { ObjectiveWorkflowStore } from 'src/app/stores/strategy-management/objective-workflow.store';
@Component({

  selector: 'app-objective-review-comment-modal',
  templateUrl: './objective-review-comment-modal.component.html',
  styleUrls: ['./objective-review-comment-modal.component.scss']
})
export class ObjectiveReviewCommentModalComponent implements OnInit {

  AppStore = AppStore;
  ProjectClosureWorkflowStore = ProjectClosureWorkflowStore;
  ObjectiveScoreStore = ObjectiveScoreStore
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
    private _objectiveReviewWorkflowService : ObjectiveWorkflowService) { }

  ngOnInit(): void {
    this.setTitle();
    AppStore.disableLoading();
  }

  setTitle() {

    this.title = ObjectiveScoreStore.type;
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

    switch (ObjectiveScoreStore.type) {

      case 'approve':
        let comment = {
          comment: this.comments
        }
        save = this._objectiveReviewWorkflowService.approveProject(ObjectiveWorkflowStore.selectedId,comment);
        break;
        case 'submit':
          let submitComment = {
            comment: this.comments
          }
          save = this._objectiveReviewWorkflowService.approveProject(ObjectiveWorkflowStore.selectedId,submitComment);
          break;

      case 'revert':
        let data = {
          comment: this.comments,
          revert_to_level:this.level
        }
        save = this._objectiveReviewWorkflowService.revertProject(ObjectiveWorkflowStore.selectedId,data);
        break;

        case 'reject':
          let rejectData = {
            comment: this.comments,
            revert_to_level:this.level
          }
          save = this._objectiveReviewWorkflowService.rejectProject(ObjectiveWorkflowStore.selectedId,rejectData);
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
    this._eventEmitterService.dismissObjectiveReviewCommentModal()
  }

  ngOnDestroy() {
    this.level=null;
    this.formErrors = null;
    this.comments = null;
  }

}
