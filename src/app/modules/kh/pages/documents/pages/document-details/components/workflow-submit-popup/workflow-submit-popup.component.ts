import { ChangeDetectorRef, Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { DocumentWorkflowService } from 'src/app/core/services/knowledge-hub/documents/document-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-workflow-submit-popup',
  templateUrl: './workflow-submit-popup.component.html',
  styleUrls: ['./workflow-submit-popup.component.scss']
})
export class WorkflowSubmitPopupComponent implements OnInit {

  @Input ('source') submitObject: any;
  AppStore = AppStore;
  FormErrors: any

  constructor(
    private _documentWorkflowService: DocumentWorkflowService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
  ) {
    
  }

  ngOnInit(): void {
  }

  submitDocument() {
    if(!AppStore.loading){
      let save;
      AppStore.enableLoading();
      if (this.submitObject.buttonType == 'Submit')
        save = this._documentWorkflowService.submittDocument()
      else
        save = this._documentWorkflowService.checkoutDocument()
  
      save.subscribe(res => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
       this.closeSubmitPopup('save');
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.FormErrors = err.error.errors
          this._utilityService.detectChanges(this._cdr);
          AppStore.disableLoading();
        }
      });
    }

    
  }

  closeSubmitPopup(type) {
    this._eventEmitterService.dismissSubmitPopup(type)
  }

  getButtonText(type){
    switch(type){
      case 'Submit' : return 'kh_submit';
      case 'Checkout': return 'kh_checkout';
      case 'Loading': return 'loading';
      case 'Cancel':return 'kh_cancel';
    }
  }

  getLowerCase(text) {

  if(text) return text.toLowerCase();
  }

}
