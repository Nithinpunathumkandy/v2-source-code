import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BcpStore } from "src/app/stores/bcm/bcp/bcp-store";
import { BcpService } from "src/app/core/services/bcm/bcp/bcp.service";
import { BcpChangeRequestService } from "src/app/core/services/bcm/bcp/bcp-change-request/bcp-change-request.service";

@Component({
  selector: 'app-bcp-workflow-comment',
  templateUrl: './bcp-workflow-comment.component.html',
  styleUrls: ['./bcp-workflow-comment.component.scss']
})
export class BcpWorkflowCommentComponent implements OnInit {

  AppStore = AppStore;
  BcpStore = BcpStore;
  title: string;
  comments: string
  formErrors: any;
  levelArray=[];
  level:number;

  constructor(private _helperService: HelperServiceService,
    private _bcpService: BcpService,
    private _eventEmitterService:EventEmitterService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef, private _bcpChangeRequestService: BcpChangeRequestService) { }

  ngOnInit(): void {
    this.setTitle()
    this.setLevel()
  }

  setTitle() {

    this.title = BcpStore.workflowType;
  }

  setLevel(){
    this.levelArray=[];
    this.levelArray.push(0);
      for(let i of BcpStore.bcpDetails?.workflow_items){
        if(i.level<BcpStore.bcpDetails?.next_review_user_level)
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

    switch (BcpStore.workflowType) {


      case 'approve':
        let comment = {
          comment: this.comments
        }
        if(BcpStore.changeRequestWorkflow)
          save = this._bcpChangeRequestService.approveWorkflow(this.BcpStore.bcpContents.change_request[0].id,comment);
        else
          save = this._bcpService.approveWorkflow(BcpStore.bcpDetails.id,comment);
        break;
        case 'submit':
          let submitComment = {
            comment: this.comments
          }
          if(BcpStore.changeRequestWorkflow)
            save = this._bcpChangeRequestService.approveWorkflow(this.BcpStore.bcpContents.change_request[0].id,submitComment);
          else
            save = this._bcpService.approveWorkflow(BcpStore.bcpDetails.id,submitComment);
          break;

      case 'revert':
        let data = {
          comment: this.comments,
          revert_to_level:this.level
        }
        if(BcpStore.changeRequestWorkflow)
          save = this._bcpChangeRequestService.revertWorkflow(this.BcpStore.bcpContents.change_request[0].id,data);
        else
          save = this._bcpService.revertWorkflow(BcpStore.bcpDetails.id,data);
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
    this._eventEmitterService.dismissIncidentInvestigationWorkflowCommentModal();
  }

  ngOnDestroy() {
    this.level=null;
    this.formErrors = null;
    this.comments = null;
  }

}
