import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { KpisService } from 'src/app/core/services/kpi-management/kpi/kpis.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { KpisStore } from 'src/app/stores/kpi-management/kpi/kpis-store';

@Component({
  selector: 'app-revert',
  templateUrl: './revert.component.html',
  styleUrls: ['./revert.component.scss']
})
export class RevertComponent implements OnInit {
  @Input('source') source: any;

  form: FormGroup;
  formErrors: any;
  saveData: any = null;
  
  AppStore = AppStore;
  KpisStore = KpisStore;

  constructor(
    private _cdr: ChangeDetectorRef,
    private _kpisService: KpisService, //*
    private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    ) { }

  ngOnInit(): void {

  this.form = this._formBuilder.group({
    comment: ['',[Validators.required]]
  });

  this.resetForm();
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  cancel() {
    this.closeFormModal();
  }
  
  closeFormModal(close:boolean=false) {
    this.resetForm();
    this._eventEmitterService.dismissKpiRevertModal(close);
  }

  getSaveData() {
    this.saveData = {
      comment: this.form.value.comment ? this.form.value.comment:'',
    }
  }

  save(close: boolean = false) {
    if (this.form.value) {

      let save;
      AppStore.enableLoading();

      this.getSaveData();

      if (this.form.value) {
        save = this._kpisService.revert(this.source.id, this.saveData);
      }
      save.subscribe(
        (res: any) => {
          this.resetForm();
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
          if (close) this.closeFormModal(close);
        },
        (err: HttpErrorResponse) => {

          AppStore.disableLoading();
          if (err.status == 422) {
            this.formErrors = err.error.errors;
          } else {
            this._utilityService.showErrorMessage('error', 'something_went_wrong_try_again');
          }
          this._utilityService.detectChanges(this._cdr);
        }
      );
    }
  }
  

}
