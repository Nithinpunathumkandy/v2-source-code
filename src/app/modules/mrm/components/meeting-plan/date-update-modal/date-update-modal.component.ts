import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MeetingPlanService } from 'src/app/core/services/mrm/meeting-plan/meeting-plan.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { MeetingPlanStore } from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
@Component({
  selector: 'app-date-update-modal',
  templateUrl: './date-update-modal.component.html',
  styleUrls: ['./date-update-modal.component.scss']
})
export class DateUpdateModalComponent implements OnInit {
  @Input('source') source: any;

  form: FormGroup;
  formErrors: any;
  saveData: any = null;

  todayDate: any = new Date();
  dateValid:boolean=false;
  
  AppStore = AppStore;
  MeetingPlanStore = MeetingPlanStore;
  OrganizationGeneralSettingsStore=OrganizationGeneralSettingsStore;

  constructor(
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _helperService:HelperServiceService,
    private _meetingPlanService:MeetingPlanService,
    private _eventEmitterService: EventEmitterService,
    ) { }

  ngOnInit(): void {

  this.form = this._formBuilder.group({
    reason: [''],
    from: ['', [Validators.required]],
    to: ['', [Validators.required]],
  });

  this.resetForm();

  this.form.get('from').valueChanges.subscribe(val => {//one houre extra set end date/time
    if (val) {
      let milliseconds = val.getTime() + (1 * 60 * 60 * 1000);
      let date = new Date(milliseconds);
      this.form.controls['to'].setValue(date);
      this.validationCheck(new Date(val));
    }
    
  });

  if (this.source)
  this.setFormData();
  }

  setFormData() {
    
    this.form.patchValue({
      from: this.source.start_date ? new Date(this.source?.start_date) : '',
      to: this.source.end_date ? new Date(this.source?.end_date) : '',
      reason:'',
    });
    this.validationCheck(new Date(this.source?.start_date));
  }

  validationCheck(startDate){
    //console.log("hi");
    if(this.todayDate.getTime() < startDate.getTime()){
      this.dateValid=false;
    }else{
      this.dateValid=true;
    }
  }

  createDateTimeValidator(flag) {
    if (flag) 
      return this.todayDate;
    else 
      return this.form.value.from?this.form.value.from:this.todayDate;
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  resetForm() {
    this.dateValid=false;
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
    this._eventEmitterService.dismissmeetingPlanDateUpadateModal(close);
  }

  getSaveData() {
    this.saveData = {
      reason: this.form.value.reason ? this.form.value.reason:'',
      from: this.form.value.from ? this._helperService.passSaveFormatDate(this.form.value.from) : '',
      to: this.form.value.to ? this._helperService.passSaveFormatDate(this.form.value.to) : '',
    }

  }

  save(close: boolean = false) {
    if (this.form.value) {

      let save;
      AppStore.enableLoading();

      this.getSaveData();

      if (this.form.value) {
        save = this._meetingPlanService.meetingPlanDateUpdate(this.source.id, this.saveData);
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
