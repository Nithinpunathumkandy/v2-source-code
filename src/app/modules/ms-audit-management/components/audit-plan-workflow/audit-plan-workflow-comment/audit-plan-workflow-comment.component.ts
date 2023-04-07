import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditPlanWorkflowService } from 'src/app/core/services/ms-audit-management/audit-plan-workflow/audit-plan-workflow.service';
import { MsAuditPlansService } from 'src/app/core/services/ms-audit-management/ms-audit-plans/ms-audit-plans.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuditPlanWorkflowStore } from 'src/app/stores/ms-audit-management/audit-plan-workflow/audit-plan-workflow.store';
import { MsAuditPlansStore } from 'src/app/stores/ms-audit-management/ms-audit-plans/ms-audit-plans-store';


@Component({
  selector: 'app-ms-audit-plan-workflow-comment',
  templateUrl: './audit-plan-workflow-comment.component.html',
  styleUrls: ['./audit-plan-workflow-comment.component.scss']
})
export class AuditPlanWorkflowCommentComponent implements OnInit {
  AppStore = AppStore;
  MsAuditPlansStore = MsAuditPlansStore;
  AuditPlanWorkflowStore = AuditPlanWorkflowStore
  title: string;
  comments: string
  formErrors: any;
  levelArray=[];
  level:number;

  constructor(private _helperService: HelperServiceService,
    private __auditPlanWorkflowService : AuditPlanWorkflowService,
    private _eventEmitterService:EventEmitterService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.setTitle()
    this.setLevel()
  }

  setTitle() {

    this.title = AuditPlanWorkflowStore.type;
  }

  setLevel(){
    this.levelArray=[];
    this.levelArray.push(0);
      for(let i of MsAuditPlansStore.individualMsAuditPlansDetails?.workflow_items){
        if(i.level<MsAuditPlansStore.individualMsAuditPlansDetails?.next_review_user_level)
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

    switch (AuditPlanWorkflowStore.type) {
      case 'approve':
        let comment = {
          comment: this.comments
        }
          save = this.__auditPlanWorkflowService.approveWorkflow(MsAuditPlansStore.individualMsAuditPlansDetails?.id,comment);
        break;
        case 'submit':
          let submitComment = {
            comment: this.comments
          }
            save = this.__auditPlanWorkflowService.approveWorkflow(MsAuditPlansStore.individualMsAuditPlansDetails?.id,submitComment);
          break;

      case 'revert':
        let data = {
          comment: this.comments,
          revert_to_level:this.level
        }
          save = this.__auditPlanWorkflowService.revertWorkflow(MsAuditPlansStore.individualMsAuditPlansDetails?.id,data);
        break;

        case 'reject':
          let data1 = {
            comment: this.comments,
          }
            save = this.__auditPlanWorkflowService.rejectProject(MsAuditPlansStore.individualMsAuditPlansDetails?.id,data1);
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
    this._eventEmitterService.dismissMsAuditWorkflowModal();
  }

  checkComment(){
    
    if(AuditPlanWorkflowStore.type=='reject'){
      return this.comments? false : true;
    }
    else if(AuditPlanWorkflowStore.type=='revert' ) {
        return this.level!=undefined && this.comments?false: true;
    } else{
      return false;
    }
  }

  ngOnDestroy() {
    this.level=null;
    this.formErrors = null;
    this.comments = null;
  }

}
