import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AmAuditPreliminaryReportsService } from 'src/app/core/services/audit-management/am-audit-preliminary-reports/am-audit-preliminary-reports.service';
import { AmPreliminaryWorkflowService } from 'src/app/core/services/audit-management/am-audit-field-work/am-preliminary-workflow/am-preliminary-workflow.service';
// import { AmAuditPreliminaryReportsService } from 'src/app/core/services/audit-management/am-audit-plan/am-audit-plan-workflow/am-audit-plan-workflow.service';
// import { AmReportService } from 'src/app/core/services/audit-management/am-audit-plan/am-audit-plan.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAuditFieldWorkStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-field-work.store';
import { AmPreliminaryReportStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-preliminary-report-store';
import { AmPreliminaryReportWorkflowStore } from 'src/app/stores/audit-management/am-audit-field-work/am-preliminary-report-workflow.store';
// import { AmPreliminaryReportWorkflowStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-plan-workflow.store';
// import { AmPreliminaryReportStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-plan.store';



@Component({
  selector: 'app-am-report-workflow-comment',
  templateUrl: './am-report-workflow-comment.component.html',
  styleUrls: ['./am-report-workflow-comment.component.scss']
})
export class AmReportWorkflowCommentComponent implements OnInit {


  AppStore = AppStore;
  AmPreliminaryReportStore = AmPreliminaryReportStore;
  AmPreliminaryReportWorkflowStore = AmPreliminaryReportWorkflowStore;
  title: string;
  comments: string
  formErrors: any;
  levelArray=[];
  level=null;

  constructor(private _helperService: HelperServiceService,
    private _amReportWorkflowService: AmPreliminaryWorkflowService,
    private _eventEmitterService:EventEmitterService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _reportService:AmAuditPreliminaryReportsService) { }

  ngOnInit(): void {

    this.setTitle()
   this.setLevel();

  }

  setTitle() {

    this.title = AmPreliminaryReportWorkflowStore.type;
  }

  getTitle(){
    if(AmPreliminaryReportWorkflowStore.type=='approve'){
      return 'approve?';
    }else if(AmPreliminaryReportWorkflowStore.type=='revert'){
    return 'revert'
    }else if(AmPreliminaryReportWorkflowStore.type=='submit'){
      return 'submit'
    }

  }

  setLevel(){
    this.levelArray=[];
    this.levelArray.push(0);
      for(let i of AmPreliminaryReportStore.reportDetails?.workflow_items){
        if(i.level<AmPreliminaryReportStore.reportDetails?.next_review_user_level)
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

    switch (AmPreliminaryReportWorkflowStore.type) {


      case 'approve':
        let comment = {
          comment: this.comments
        }
        save = this._amReportWorkflowService.approveReport(AmPreliminaryReportStore.reportDetails?.id,comment);
        break;
        case 'submit':
          let submitComment = {
            comment: this.comments
          }
          save = this._amReportWorkflowService.approveReport(AmPreliminaryReportStore.reportDetails?.id,submitComment);
          break;

      case 'revert':
        let data = {
          comment: this.comments,
          revert_to_level:this.level
        }
        save = this._amReportWorkflowService.revertReport(AmPreliminaryReportStore.reportDetails?.id,data);
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
    this._eventEmitterService.dismissAmPreliminaryWorkflowCommentModal()
  }

  ngOnDestroy() {
    this.level=null;
    this.formErrors = null;
    this.comments = null;
  }



}
