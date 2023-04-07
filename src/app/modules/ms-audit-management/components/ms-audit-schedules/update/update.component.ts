import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MsAuditScheduleStatusesService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-schedule-statuses/ms-audit-schedule-statuses.service';
import { MsAuditSchedulesService } from 'src/app/core/services/ms-audit-management/ms-audit-schedules/ms-audit-schedules.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { MsAuditScheduleStatusMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-schedule-status-store';
import { MsAuditSchedulesStore } from 'src/app/stores/ms-audit-management/ms-audit-schedules/ms-audit-schedules-store';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  @Input('source') source: any;

  form: FormGroup;
  formErrors: any;
  saveData: any = null;

  todayDate:any = new Date();
  minDate:any = new Date();
  maxDate:any = new Date();

  AppStore = AppStore;
  MsAuditSchedulesStore = MsAuditSchedulesStore;
  MsAuditScheduleStatusMasterStore = MsAuditScheduleStatusMasterStore;
  allStatusSchedule=[]

  constructor(
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _msAuditSchedulesService: MsAuditSchedulesService,
    private _msAuditScheduleStatusesService: MsAuditScheduleStatusesService,//master
    ) { }

  ngOnInit(): void {

  this.form = this._formBuilder.group({
    new_date:['',[Validators.required]],
    new_end_date:['',[Validators.required]],
    reason: [''],
    ms_audit_schedule_status_id:[null,[Validators.required]]
  });

  this.resetForm();

    this.minDate= MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.audit_plan_details?.start_date;
    this.maxDate= MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.audit_plan_details?.end_date;
    
    this.getMsAuditScheduleStatus();
  }

  getMsAuditScheduleStatus() {
    this._msAuditScheduleStatusesService.getItems(false).subscribe(res => {
      
      this.setStatusValue(res);
      this.form.controls['ms_audit_schedule_status_id'].setValue(this.checkStatus(res?.data));
      this._utilityService.detectChanges(this._cdr);
    });
  }

  checkStatus(data)
  {
    let item=null;
    for(let i of data)
    {
      if(i.type=='proposed-new-time')
      {
        item=i;
        break;
      }
    }
    return item;
  }

  setStatusValue(res)
  {
    this.allStatusSchedule=[];
    for(let i of res.data)
      {
        if(i.title!='Audited')
        {
          this.allStatusSchedule.push(i);
        }
      }
      //console.log(this.allStatusSchedule)
  }

  searchMsAuditScheduleStatus(event) {
    this._msAuditScheduleStatusesService.getItems(true,'?q=' + event.term).subscribe(res => {
      this.setStatusValue(res);
      this._utilityService.detectChanges(this._cdr);
    });
  }

  minEndDateTimeValidator() {
    return this.form.value.start_date?this.form.value.start_date:this.minDate;
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
    this._eventEmitterService.dismissMsAuditSchedulesUpdateModal(close);
  }

  getSaveData() {
    this.saveData = {
      reason: this.form.value.reason ? this.form.value.reason:'',
      new_date: this.form.value.new_date ? this._helperService.passSaveFormatDate(this.form.value.new_date) : '',
      new_end_date: this.form.value.new_end_date ? this._helperService.passSaveFormatDate(this.form.value.new_end_date) : '',
      ms_audit_schedule_status_id: this.form.value.ms_audit_schedule_status_id? this.form.value.ms_audit_schedule_status_id.id: null,
    }
  }

  save(close: boolean = false) {
    if (this.form.value) {

      let save;
      AppStore.enableLoading();

      this.getSaveData();

      if (this.form.value) {
        save = this._msAuditSchedulesService.update(this.source.id, this.saveData);
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
