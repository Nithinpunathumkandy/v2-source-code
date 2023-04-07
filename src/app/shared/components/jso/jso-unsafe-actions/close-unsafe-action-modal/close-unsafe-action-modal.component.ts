import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { JsoUnsafeActionsService } from 'src/app/core/services/jso/unsafe-actions/jso-unsafe-actions.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';

@Component({
  selector: 'app-close-unsafe-action-modal',
  templateUrl: './close-unsafe-action-modal.component.html',
  styleUrls: ['./close-unsafe-action-modal.component.scss']
})
export class CloseUnsafeActionModalComponent implements OnInit {

  @Input('source') formObject: any;

  form: FormGroup;
  formErrors: any;

  AppStore = AppStore;

  constructor( private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService:EventEmitterService,
    private _helperService: HelperServiceService,
    private _unsafeActionService:JsoUnsafeActionsService,
    private _formBuilder:FormBuilder,) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      closure_date: [''],
      comments: [''],
    });
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  save(close) {
    let save;
    let saveData;
    AppStore.enableLoading();
      saveData = {
        comments: this.form.value.comments ? this.form.value.comments : null,
        closure_date: this.form.value.closure_date ? this._helperService.processDate(this.form.value.closure_date, '') : null,
      }
      save = this._unsafeActionService.closeUnsafeAction(this.formObject.id,saveData);

    save.subscribe((res: any) => {
      this.resetForm();
      AppStore.disableLoading();

      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
        if (close) {
          this.closeFormModal();
          this.resetForm();
        }

      }, 300);

    }, (err: HttpErrorResponse) => {
      if (err.status == 422) { 
        this.formErrors = err.error.errors;
      }
      else if (err.status == 500 || err.status == 404) {
        AppStore.disableLoading();
        this.closeFormModal();
        this.resetForm();
      }
      else {
        this._utilityService.showErrorMessage('Error', 'Something Went Wrong Try Again Later');
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    });
  }

  closeFormModal() {
    this._eventEmitterService.dismissCloseUnsafeActionModal();
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }
}
