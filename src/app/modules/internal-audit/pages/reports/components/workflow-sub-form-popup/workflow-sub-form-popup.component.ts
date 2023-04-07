import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditWorkflowService } from 'src/app/core/services/internal-audit/audit-workflow/audit-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuditReportWorkflowStore } from 'src/app/stores/internal-audit/audit-workflow/audit-report-workflow.store';

@Component({
  selector: 'app-workflow-sub-form-popup',
  templateUrl: './workflow-sub-form-popup.component.html',
  styleUrls: ['./workflow-sub-form-popup.component.scss']
})
export class WorkflowSubFormPopupComponent implements OnInit {

  title: string;
  comments:string
  formErrors: any
  AppStore = AppStore;
  AuditReportWorkflowStore=AuditReportWorkflowStore;
  constructor(

    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _auditWorkflowService:AuditWorkflowService,
  ) { }

  ngOnInit(): void {

    this.setTitle()
  }



  setTitle() {

    AuditReportWorkflowStore.finalReviewUserLevel = AuditReportWorkflowStore.auditReportWorkflow.length > 0 ? AuditReportWorkflowStore.auditReportWorkflow[AuditReportWorkflowStore.auditReportWorkflow.length - 1].level : null;

    if (AuditReportWorkflowStore.nextReviewUserLevel == AuditReportWorkflowStore.finalReviewUserLevel && this.AuditReportWorkflowStore.type=='approve')
      this.title = 'publish'
    else
      this.title=AuditReportWorkflowStore.type
  }


  getButtonText(text) {
    
    // * Checking for Last Level and Setting Button Text as Publish 
    // * If not Last Level Setting Button Text as the Selected Type (Approve | Reject | Revert)

    if (AuditReportWorkflowStore.nextReviewUserLevel == AuditReportWorkflowStore.finalReviewUserLevel && text =='approve')
      return this._helperService.translateToUserLanguage('publish');
    else
    return this._helperService.translateToUserLanguage(text);

   
  }

  save(close: boolean = false) {

    let save;
  AppStore.enableLoading();  
  
  let comment = {
    comment:this.comments
  }

  switch (AuditReportWorkflowStore.type) {

    case 'approve':
      save = this._auditWorkflowService.approveReport(comment);
      break;
    case 'publish':
      save = this._auditWorkflowService.publishReport(comment);
      break;
    
    case 'reject':
      save = this._auditWorkflowService.rejectReport(comment);
      break;
    
    case 'revert':
      save = this._auditWorkflowService.revertReport(comment);
      break;

    default:
      break;
  }

    save.subscribe(
      (res: any) => {
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      },
      (err: HttpErrorResponse) => {
        AppStore.disableLoading();
        if (err.status == 422) {
          this.formErrors = err.error;
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
  this.comments = null;
  this._eventEmitterService.dismissCommentModal()
}

ngOnDestroy() {
  this.formErrors = null;
  this.comments = null;
}

}
