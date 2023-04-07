import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { documentWorkFlowStore } from 'src/app/stores/knowledge-hub/documents/documentWorkFlow.store';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { DocumentsService } from 'src/app/core/services/knowledge-hub/documents/documents.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-review-update-popup',
  templateUrl: './review-update-popup.component.html',
  styleUrls: ['./review-update-popup.component.scss']
})
export class ReviewUpdatePopupComponent implements OnInit {

  AppStore = AppStore;
  documentWorkFlowStore = documentWorkFlowStore;
  title: string;
  comments:string
  formErrors: any;
  form:FormGroup
  constructor(
    private formBuilder:FormBuilder,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _documentsService:DocumentsService
  ) { }

  ngOnInit(): void {

    this.form=this.formBuilder.group({
      comment:['',[Validators.required]]
    })
    
    this.setTitle()

  }

  setTitle() {
    if (documentWorkFlowStore.nextReviewUserLevel == documentWorkFlowStore.finalReviewUserLevel && this.documentWorkFlowStore.type=='approve')
      this.title = 'publish'
    else
      this.title=documentWorkFlowStore.type
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  save(close: boolean = false) {

      let save;
    AppStore.enableLoading();  
    
    let comment = {
      comment:this.form.value.comment
    }
    
    save = this._documentsService.updateFrequentReviewUpdates(comment);            
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
    this.form.reset()
    this._eventEmitterService.dismissDocumentUpdate()
  }

  ngOnDestroy() {
    this.formErrors = null;
    this.comments = null;
    this.form.reset()
  }


}
