import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AuditWorkflowService } from 'src/app/core/services/internal-audit/audit-workflow/audit-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';

@Component({
  selector: 'app-workflow-form-popup',
  templateUrl: './workflow-form-popup.component.html',
  styleUrls: ['./workflow-form-popup.component.scss']
})
export class WorkflowFormPopupComponent implements OnInit {
  
  @Input ('source') submitObject: any;
  AppStore = AppStore;
  FormErrors: any
  

  constructor(
    private _auditWorkflowService:AuditWorkflowService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {
  }

  submitDocument() {
    let save;
    AppStore.enableLoading();
    save = this._auditWorkflowService.submitReport()
    // if (this.submitObject.type == 'Document') {
    
    // if (this.submitObject.buttonType == 'Submit')
    //   save = this._documentWorkflowService.submittDocument()
    // else
    //     save = this._documentWorkflowService.checkoutDocument()
    // }
    // else {
    //   if (this.submitObject.buttonType == 'Submit')
    //     save = this._changeRequestWorkflowService.submittDocument()
      
    // }
    
    save.subscribe(res => {
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
     this.closeSubmitPopup();
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.FormErrors = err.error.errors
        this._utilityService.detectChanges(this._cdr);
        AppStore.disableLoading();
      }
    });
  }

  closeSubmitPopup() {
    this._eventEmitterService.dismissSubmitPopup(this.submitObject.buttonType)
  }

  getButtonText(type){
    switch(type){
      case 'Submit' : return 'kh_submit';
      case 'Loading': return 'loading';
      case 'Cancel':return 'kh_cancel';
    }
  }

  getLowerCase(text) {

  if(text) return text.toLowerCase();
  }

}
