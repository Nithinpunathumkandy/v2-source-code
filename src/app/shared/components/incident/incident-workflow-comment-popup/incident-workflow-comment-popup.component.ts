import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { IncidentInvestigationWorkflowService } from 'src/app/core/services/incident-management/incident-investogation-workflow/incident-investigation-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { IncidentInvestigationWorkflowStore } from 'src/app/stores/incident-management/incident-workflow/incident-investigation-workflow.store';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';

@Component({
  selector: 'app-incident-workflow-comment-popup',
  templateUrl: './incident-workflow-comment-popup.component.html',
  styleUrls: ['./incident-workflow-comment-popup.component.scss']
})
export class IncidentWorkflowCommentPopupComponent implements OnInit {

  AppStore = AppStore;
  IncidentinvestigationStore = IncidentInvestigationStore
  IncidentInvestigationWorkflowStore = IncidentInvestigationWorkflowStore;
  title: string;
  comments: string
  formErrors: any;
  levelArray=[];
  level:number;

  constructor(private _helperService: HelperServiceService,
    private _incidentInvestigationWorkflowService: IncidentInvestigationWorkflowService,
    private _eventEmitterService:EventEmitterService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _IncidentInvestigationWorkflowService:IncidentInvestigationWorkflowService) { }

  ngOnInit(): void {
    this.setTitle()
    this.setLevel()
  }

  setTitle() {

    this.title = IncidentInvestigationWorkflowStore.type;
  }

  setLevel(){
    this.levelArray=[];
    this.levelArray.push(0);
      for(let i of IncidentInvestigationStore.individualInvestigationItem?.workflow_items){
        if(i.level<IncidentInvestigationStore.individualInvestigationItem?.next_review_user_level)
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

    switch (IncidentInvestigationWorkflowStore.type) {


      case 'approve':
        let comment = {
          comment: this.comments
        }
        save = this._IncidentInvestigationWorkflowService.approveIncidentInvestigation(IncidentInvestigationStore.selectedId,comment);
        break;
        case 'submit':
          let submitComment = {
            comment: this.comments
          }
          save = this._IncidentInvestigationWorkflowService.approveIncidentInvestigation(IncidentInvestigationStore.selectedId,submitComment);
          break;

      case 'revert':
        let data = {
          comment: this.comments,
          revert_to_level:this.level
        }
        save = this._IncidentInvestigationWorkflowService.revertIncidentInvestigation(IncidentInvestigationStore.selectedId,data);
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
    this._eventEmitterService.dismissIncidentInvestigationWorkflowCommentModal()
  }

  ngOnDestroy() {
    this.level=null;
    this.formErrors = null;
    this.comments = null;
  }

}
