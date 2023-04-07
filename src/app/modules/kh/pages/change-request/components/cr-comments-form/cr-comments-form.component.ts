import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DocumentWorkflowService } from 'src/app/core/services/knowledge-hub/documents/document-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { documentWorkFlowStore } from 'src/app/stores/knowledge-hub/documents/documentWorkFlow.store';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ChangeRequestWorkflowService } from 'src/app/core/services/knowledge-hub/change-request/change-request-workflow.service';

@Component({
  selector: 'app-cr-comments-form',
  templateUrl: './cr-comments-form.component.html',
  styleUrls: ['./cr-comments-form.component.scss']
})
export class CrCommentsFormComponent implements OnInit {

  @Input('source') source

  AppStore = AppStore;
  documentWorkFlowStore = documentWorkFlowStore;
  title: string;
  comments:string
  formErrors: any;

  constructor(
    private _helperService: HelperServiceService,
    private _documentWorkflowService: DocumentWorkflowService,
    private _changeRequestWorkflowService: ChangeRequestWorkflowService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {
    AppStore.disableLoading();
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
    comment:this.comments
  }

      if(this.source.title=='approve')
        save = this._changeRequestWorkflowService.approveDocument(comment);
    
      if(this.source.title=='publish')
        save = this._changeRequestWorkflowService.publishDocument(comment);
    
      if(this.source.title=='reject')
        save = this._changeRequestWorkflowService.rejectDocument(comment);
    
      if(this.source.title=='revert')
        save = this._changeRequestWorkflowService.revertDocument(comment);
        
  save.subscribe(
    (res: any) => {
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
  this.comments = null;
  this._eventEmitterService.dismissCommentModal()
}

ngOnDestroy() {
  this.formErrors = null;
  this.comments = null;
}

}
