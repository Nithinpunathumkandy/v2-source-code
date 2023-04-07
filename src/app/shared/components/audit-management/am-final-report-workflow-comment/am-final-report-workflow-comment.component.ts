import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AmFinalWorkflowService } from 'src/app/core/services/audit-management/am-audit-field-work/am-draft-workflow/am-final-workflow/am-final-workflow.service';
import { AmAuditFinalReportsService } from 'src/app/core/services/audit-management/am-audit-final-reports/am-audit-final-reports.service';
// import { AmAuditFinalReportsService } from 'src/app/core/services/audit-management/am-audit-plan/am-audit-plan-workflow/am-audit-plan-workflow.service';
// import { AmReportService } from 'src/app/core/services/audit-management/am-audit-plan/am-audit-plan.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAuditFieldWorkStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-field-work.store';
import { AmFinalReportStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-final-report-store';
import { AmFinalReportWorkflowStore } from 'src/app/stores/audit-management/am-audit-field-work/am-final-report-workflow.store';
// import { AmFinalReportWorkflowStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-plan-workflow.store';
// import { AmFinalReportStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-plan.store';



@Component({
  selector: 'app-am-final-report-workflow-comment',
  templateUrl: './am-final-report-workflow-comment.component.html',
  styleUrls: ['./am-final-report-workflow-comment.component.scss']
})
export class AmFinalReportWorkflowCommentComponent implements OnInit {

  AppStore = AppStore;
  AmFinalReportStore = AmFinalReportStore;
  AmFinalReportWorkflowStore = AmFinalReportWorkflowStore;
  title: string;
  comments: string
  formErrors: any;
  levelArray=[];
  level=null;

  constructor(private _helperService: HelperServiceService,
    private _amReportWorkflowService: AmFinalWorkflowService,
    private _eventEmitterService:EventEmitterService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _reportService:AmAuditFinalReportsService) { }

  ngOnInit(): void {

    this.setTitle()
   this.setLevel();

  }

  setTitle() {

    this.title = AmFinalReportWorkflowStore.type;
  }

  getTitle(){
    if(AmFinalReportWorkflowStore.type=='approve'){
      return 'approve?';
    }else if(AmFinalReportWorkflowStore.type=='revert'){
    return 'revert'
    }else if(AmFinalReportWorkflowStore.type=='submit'){
      return 'submit'
    }

  }

  setLevel(){
    this.levelArray=[];
    this.levelArray.push(0);
      for(let i of AmFinalReportStore.reportDetails?.workflow_items){
        if(i.level<AmFinalReportStore.reportDetails?.next_review_user_level)
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

    switch (AmFinalReportWorkflowStore.type) {


      case 'approve':
        let comment = {
          comment: this.comments
        }
        save = this._amReportWorkflowService.approveReport(AmFinalReportStore.reportDetails?.id,comment);
        break;
        case 'submit':
          let submitComment = {
            comment: this.comments
          }
          save = this._amReportWorkflowService.approveReport(AmFinalReportStore.reportDetails?.id,submitComment);
          break;

      case 'revert':
        let data = {
          comment: this.comments,
          revert_to_level:this.level
        }
        save = this._amReportWorkflowService.revertReport(AmFinalReportStore.reportDetails?.id,data);
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
        this._reportService.getItems(AmAuditFieldWorkStore.auditFieldWorkId).subscribe(res=>{
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
    this._eventEmitterService.dismissAmFinalWorkflowCommentModal()
  }

  ngOnDestroy() {
    this.level=null;
    this.formErrors = null;
    this.comments = null;
  }



}
