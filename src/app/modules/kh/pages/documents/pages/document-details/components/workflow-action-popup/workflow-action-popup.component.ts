import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DocumentWorkflowService } from 'src/app/core/services/knowledge-hub/documents/document-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { documentWorkFlowStore } from 'src/app/stores/knowledge-hub/documents/documentWorkFlow.store';
import { HttpErrorResponse} from '@angular/common/http';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';

@Component({
  selector: 'app-workflow-action-popup',
  templateUrl: './workflow-action-popup.component.html',
  styleUrls: ['./workflow-action-popup.component.scss']
})
export class WorkflowActionPopupComponent implements OnInit {

  AppStore = AppStore;
  documentWorkFlowStore = documentWorkFlowStore;
  title: string;
  comments:string
  formErrors: any;
  constructor(
    private _helperService: HelperServiceService,
    private _documentWorkflowService: DocumentWorkflowService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {
    
    console.log("Hellooo")
    this.setTitle()

  }

  setTitle() {
    if (documentWorkFlowStore.nextReviewUserLevel == documentWorkFlowStore.finalReviewUserLevel && this.documentWorkFlowStore.type=='approve')
      this.title = 'publish'
    else
      this.title=documentWorkFlowStore.type
  }

  getButtonText(text) {
    
    // * Checking for Last Level and Setting Button Text as Publish 
    // * If not Last Level Setting Button Text as the Selected Type (Approve | Reject | Revert)

    if (documentWorkFlowStore.nextReviewUserLevel == documentWorkFlowStore.finalReviewUserLevel && text =='approve')
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

    switch (documentWorkFlowStore.type) {

      case 'approve':
        save = this._documentWorkflowService.approveDocument(comment);
        break;    
      case 'publish':
        save = this._documentWorkflowService.publishDocument(comment);
        break;
      
      case 'reject':
        save = this._documentWorkflowService.rejectDocument(comment);
        break;
      
      case 'revert':
        save = this._documentWorkflowService.revertDocument(comment);
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
