import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SlaContractWorkflowService } from 'src/app/core/services/compliance-management/sla-contract-workflow/sla-contract-workflow.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { IncidentInvestigationWorkflowService } from 'src/app/core/services/incident-management/incident-investogation-workflow/incident-investigation-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { SlaContractWorkflowStore } from 'src/app/stores/compliance-management/compliance-workflow/sla-contract-workflow.store';
import { SLAContractStore } from 'src/app/stores/compliance-management/sla-contract/sla-contract-store';

@Component({
  selector: 'app-sla-contract-workflow-comment',
  templateUrl: './sla-contract-workflow-comment.component.html',
  styleUrls: ['./sla-contract-workflow-comment.component.scss']
})
export class SlaContractWorkflowCommentComponent implements OnInit {

  AppStore = AppStore;
  SLAContractStore = SLAContractStore
  SlaContractWorkflowStore = SlaContractWorkflowStore;
  title: string;
  comments: string
  formErrors: any;
  levelArray=[];
  level:number;

  constructor(private _helperService: HelperServiceService,
    private _eventEmitterService:EventEmitterService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _SlaContractWorkflowService:SlaContractWorkflowService) { }

  ngOnInit(): void {
    this.setTitle()
    this.setLevel()
  }

  setTitle() {

    this.title = SlaContractWorkflowStore.type;
  }

  setLevel(){
    this.levelArray=[];
    this.levelArray.push(0);
      for(let i of SLAContractStore.slaContractDetails?.workflow_items){
        if(i.level<SLAContractStore.slaContractDetails?.next_review_user_level)
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

    switch (SlaContractWorkflowStore.type) {


      case 'approve':
        let comment = {
          comment: this.comments
        }
        save = this._SlaContractWorkflowService.approveIncidentInvestigation(SLAContractStore.sla_contract_id,comment);
        break;
        case 'submit':
          let submitComment = {
            comment: this.comments
          }
          save = this._SlaContractWorkflowService.approveIncidentInvestigation(SLAContractStore.sla_contract_id,submitComment);
          break;

      case 'revert':
        let data = {
          comment: this.comments,
          revert_to_level:this.level
        }
        save = this._SlaContractWorkflowService.revertIncidentInvestigation(SLAContractStore.sla_contract_id,data);
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
    this._eventEmitterService.dismissSlaContractWorkflowCommentModal()
  }

  ngOnDestroy() {
    this.level=null;
    this.formErrors = null;
    this.comments = null;
  }

}
