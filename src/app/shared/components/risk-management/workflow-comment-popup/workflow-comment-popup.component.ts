import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RiskInfoWorkflowService } from 'src/app/core/services/risk-management/risks/risk-info-workflow/risk-info-workflow.service';
import { RisksService } from 'src/app/core/services/risk-management/risks/risks.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { RiskInfoWorkflowStore } from 'src/app/stores/risk-management/risks/risk-info-workflow.store';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';

@Component({
  selector: 'app-workflow-comment-popup',
  templateUrl: './workflow-comment-popup.component.html',
  styleUrls: ['./workflow-comment-popup.component.scss']
})
export class WorkflowCommentPopupComponent implements OnInit {

  AppStore = AppStore;
  RisksStore = RisksStore;
  RiskInfoWorkflowStore = RiskInfoWorkflowStore;
  title: string;
  comments: string
  formErrors: any;
  levelArray=[];
  level=null;

  constructor(private _helperService: HelperServiceService,
    private _riskInfoWorkflowService: RiskInfoWorkflowService,
    private _eventEmitterService:EventEmitterService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _risksService:RisksService) { }

  ngOnInit(): void {

    this.setTitle()
   this.setLevel();

  }

  setTitle() {

    this.title = RiskInfoWorkflowStore.type;
  }

  getTitle(){
    if(RiskInfoWorkflowStore.type=='approve'){
      return 'approve?';
    }else if(RiskInfoWorkflowStore.type=='revert'){
    return 'revert'
    }else if(RiskInfoWorkflowStore.type=='submit'){
      return 'submit'
    }

  }

  setLevel(){
    this.levelArray=[];
    this.levelArray.push(0);
      for(let i of RisksStore.individualRiskDetails?.workflow_items){
        if(i.level<RisksStore.individualRiskDetails?.next_review_user_level)
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

    switch (RiskInfoWorkflowStore.type) {


      case 'approve':
        let comment = {
          comment: this.comments
        }
        save = this._riskInfoWorkflowService.approveRisk(RisksStore.riskId,comment);
        break;
        case 'submit':
          let submitComment = {
            comment: this.comments
          }
          save = this._riskInfoWorkflowService.approveRisk(RisksStore.riskId,submitComment);
          break;

      case 'revert':
        let data = {
          comment: this.comments,
          revert_to_level:this.level
        }
        save = this._riskInfoWorkflowService.revertRisk(RisksStore.riskId,data);
        break;



      // case 'submit':
      //     save = this._documentWorkflowService.submittDocument(comment);
      //   break;

      // case 'publish':
      //   if(documentWorkFlowStore.moduleType=='Change Request')
      //     save = this._changeRequestWorkflowService.publishDocument(comment);
      //   else
      //   save = this._documentWorkflowService.publishDocument(comment);
      //   break;

      // case 'reject':
      //   if(documentWorkFlowStore.moduleType=='Change Request')
      //     save = this._changeRequestWorkflowService.rejectDocument(comment);
      //   else
      //   save = this._documentWorkflowService.rejectDocument(comment);
      //   break;



      default:
        break;
    }

    save.subscribe(
      (res: any) => {
        this._risksService.getItem(RisksStore.riskId).subscribe(res=>{
          this._utilityService.detectChanges(this._cdr);
     
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      })
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
    this._eventEmitterService.dismissRiskWorkflowCommentModal()
  }

  ngOnDestroy() {
    this.level=null;
    this.formErrors = null;
    this.comments = null;
  }


}
