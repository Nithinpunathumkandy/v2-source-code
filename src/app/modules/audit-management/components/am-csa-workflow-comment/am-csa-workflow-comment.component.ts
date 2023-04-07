import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AmCSAWorkflowService } from 'src/app/core/services/audit-management/am-csa-workflow/am-csa-workflow.service';
import { AmCsaService } from 'src/app/core/services/audit-management/am-csa/am-csa.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAuditPlansStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-plan.store';
import { AmCSAWorkflowStore } from 'src/app/stores/audit-management/am-csa/am-csa-workflow.store';
import { AmCSAStore } from 'src/app/stores/audit-management/am-csa/am-csa.store';

@Component({
  selector: 'app-am-csa-workflow-comment',
  templateUrl: './am-csa-workflow-comment.component.html',
  styleUrls: ['./am-csa-workflow-comment.component.scss']
})
export class AmCsaWorkflowCommentComponent implements OnInit {

  AppStore = AppStore;
  AmCSAStore = AmCSAStore
  AmCSAWorkflowStore = AmCSAWorkflowStore
  AmAuditPlansStore = AmAuditPlansStore;
  title: string;
  comments: string
  formErrors: any;
  levelArray=[];
  level:number;

  constructor(
    private _helperService: HelperServiceService,
    private _eventEmitterService:EventEmitterService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _csaService: AmCsaService,
    private _amCSAWorkflowService:AmCSAWorkflowService,
  ) { }

  ngOnInit(): void {
    this.setTitle()
    this.setLevel();
  }

  setTitle() {

    this.title = AmCSAWorkflowStore.type;
  }

  getTitle(){
    if(AmCSAWorkflowStore.type=='approve'){
      return 'approve?';
    }else if(AmCSAWorkflowStore.type=='revert'){
    return 'revert'
    }else if(AmCSAWorkflowStore.type=='submit'){
      return 'submit'
    }

  }

  setLevel(){
    this.levelArray=[];
    this.levelArray.push(0);
      for(let i of AmCSAStore.individualCSADetails?.workflow_items){
        if(i.level<AmCSAStore.individualCSADetails?.next_review_user_level)
        this.levelArray.push(i.level);
      }
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  save(close: boolean = false) {

    let save;
    AppStore.enableLoading();

    let comment = {
      comment: this.comments
    }

    switch (AmCSAWorkflowStore.type) {

      case 'approve':
        let comment = {
          comment: this.comments
        }
        save = this._amCSAWorkflowService.approveCSA(AmCSAStore.csaId,comment);
        break;
        case 'submit':
          let submitComment = {
            comment: this.comments
          }
          save = this._amCSAWorkflowService.approveCSA(AmCSAStore.csaId,submitComment);
          break;

      case 'revert':
        let data = {
          comment: this.comments,
          revert_to_level:this.level
        }
        save = this._amCSAWorkflowService.revertCSA(AmCSAStore.csaId,data);
        break;

      default:
        break;
    }

    save.subscribe(
      (res: any) => {
        this._csaService.getItem(AmCSAStore.csaId).subscribe(res=>{
          this._utilityService.detectChanges(this._cdr);
     
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      })
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
    this._eventEmitterService.dismissCSAWorkflowCommentModal()
  }

  ngOnDestroy() {
    this.level=null;
    this.formErrors = null;
    this.comments = null;
  }

}
