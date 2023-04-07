import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuditSchedulesStore } from 'src/app/stores/internal-audit/audit-schedule/audit-schedule-store';
import { AuditScheduleService } from 'src/app/core/services/internal-audit/audit-schedule/audit-schedule.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DatePipe } from '@angular/common';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-schedule-date-update-modal',
  templateUrl: './schedule-date-update-modal.component.html',
  styleUrls: ['./schedule-date-update-modal.component.scss']
})
export class ScheduleDateUpdateModalComponent implements OnInit {
  @Input('source') ScheduleDateUpdateSource: any;

  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  AuditSchedulesStore = AuditSchedulesStore;
  pipe = new DatePipe('en-US');
  constructor(private _auditScheduleService:AuditScheduleService,
    private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _helperService:HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService) { }

  ngOnInit(): void {
     // Form Object to add Control Category

     $(document).ready(function(){
    $("#startId,#startIdButton,#endId,#endIdButton").click(function(){
       $(".cdk-overlay-container").css({ "font-position": "fixed","z-index": "9999999"});
     });
   });
  this.form = this._formBuilder.group({
    id:[''],
    start_date: ['', [Validators.required, Validators.maxLength(255)]],
    end_date: ['',[Validators.required, Validators.maxLength(255)]]
  });

  this.resetForm();


  // setting form values from source
  if(this.ScheduleDateUpdateSource.type=='Edit'){
    this.setFormValues();
  }


  }

  ngDoCheck(){
    if (this.ScheduleDateUpdateSource && this.ScheduleDateUpdateSource.hasOwnProperty('values') && this.ScheduleDateUpdateSource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues(){

    if (this.ScheduleDateUpdateSource.hasOwnProperty('values') && this.ScheduleDateUpdateSource.values) {
      this.form.setValue({

        id: this.ScheduleDateUpdateSource.values.id,
        start_date:this.ScheduleDateUpdateSource.values.start_date ? new Date(this.ScheduleDateUpdateSource.values.start_date):'',
        end_date: this.ScheduleDateUpdateSource.values.end_date ? new Date(this.ScheduleDateUpdateSource.values.end_date):''
        //start_date: this.formatDate(this.ScheduleDateUpdateSource.values.start_date),
        //MeetingPlanStore.individualMeetingPlanDetails.start_date ? new Date(MeetingPlanStore.individualMeetingPlanDetails?.start_date) : '',
        //end_date: this.formatDate(this.ScheduleDateUpdateSource.values.end_date)
      })
    }
  }

  formatDate(date)
  {
    let dormatted= this.pipe.transform(date, 'short');            
    //return new Date(new Date(dormatted));
    return this.getTimezoneFormatted(date)
    
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  passSaveFormatDate(date)
  {
   const fromdate = this.pipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
   return fromdate;
  }

  // for resetting the form
  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }
  // cancel modal
  cancel() {
    // FormErrorStore.setErrors(null);
    this.closeFormModal();
  
  
  }
  
  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissDateOnlyUpdateAuditSchedule();
  }

  
  // function for add & update
  save(close: boolean = false) {

    this.formErrors = null;
    this.form.patchValue({
      start_date: this.passSaveFormatDate(this.form.value.start_date),
      end_date : this.passSaveFormatDate(this.form.value.end_date),
    })
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
        save = this._auditScheduleService.updateItem(this.form.value.id,this.form.value);
      save.subscribe((res: any) => {
        AuditSchedulesStore.active_schedule_id = this.ScheduleDateUpdateSource.values.id;
         if(!this.form.value.id){
         this.resetForm();}
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;}
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        
      });
    }
   }
  
}

