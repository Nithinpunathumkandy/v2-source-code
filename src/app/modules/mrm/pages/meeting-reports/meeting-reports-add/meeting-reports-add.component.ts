import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MeetingsService } from 'src/app/core/services/mrm/meetings/meetings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { MeetingsStore } from 'src/app/stores/mrm/meetings/meetings-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { HttpErrorResponse } from '@angular/common/http';
import { MeetingReportService } from 'src/app/core/services/mrm/meeting-report/meeting-report.service';
import { ReportStore } from 'src/app/stores/mrm/meeting-report/meeting-report.store';
import { MeetingReportTemplatesService } from 'src/app/core/services/mrm/meeting-report-templates/meeting-report-templates.service';
import { MeetingReportTemeplates } from 'src/app/stores/mrm/meeting-report-templates/meeting-report-templates';

@Component({
  selector: 'app-meeting-reports-add',
  templateUrl: './meeting-reports-add.component.html',
  styleUrls: ['./meeting-reports-add.component.scss']
})
export class MeetingReportsAddComponent implements OnInit {

  @Input('source') reportObject: any;
  @Input('selectedMeeting') selectedMeetingData: any;

  MeetingsStore = MeetingsStore;
  MeetingReportTemeplates = MeetingReportTemeplates;
  reactionDisposer: IReactionDisposer;
  ReportStore = ReportStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  
  form: FormGroup;
  formErrors: any;
  saveData: any = null;
  
  constructor( 
    private _router: Router,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _meetingsService: MeetingsService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _reportService: MeetingReportService,
    private _meetingReportTemplatesService:MeetingReportTemplatesService
  ) { }

    ngOnInit(): void {

      AppStore.showDiscussion = false;
      AppStore.disableLoading();
  
      this.form = this._formBuilder.group({
        
        id: [null],
        title: ["",[Validators.required]],
        meeting_id: [null, [Validators.required]],
        meeting_report_templated_id: [null,[Validators.required]],
      });
  
      this.resetForm();
 
  
      if (ReportStore.editFlag && this.reportObject.values) {
        this.form.controls['meeting_id'].clearValidators();
        this.setEditDetails();
      }
      
      if (this.selectedMeetingData) {
        
        this.form.patchValue({
          'meeting_id':this.selectedMeetingData,
          'title':this.selectedMeetingData.title
        })
      }

      if (!ReportStore.editFlag) {
        this.form.get('meeting_id').valueChanges.subscribe(val => {// prv meeting_title set title
          
          if (val?.title) {
            this.form.controls['title'].setValue(`${val?.title}`);
          } else {
            if (!ReportStore.editFlag) {
              this.form.controls['title'].setValue("");
            }
          }
        });
      }
  
      this.getMeeting();
      this.getMeetingReportTemeplate();
    }
  
  setEditDetails() {
    
    this.searchMeetingReportTemeplate({ term: this.reportObject.values.meeting_report_template_id });
    this.form.patchValue({
      id:this.reportObject.values.id ? this.reportObject.values.id : null,
      title: this.reportObject.values.title ? this.reportObject.values.title : '',
      meeting_report_templated_id: this.reportObject.values.meeting_report_template_id?this.reportObject.values.meeting_report_template_id:''
    })

  }

    getMeeting(){
      this._meetingsService.getItems(false).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });  
    }
    
    searchMeeting(event){
      this._meetingsService.getSearchItems('q='+event.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }

    getMeetingReportTemeplate() {
      this._meetingReportTemplatesService.getItems(false,null,'active').subscribe(res =>{
        this._utilityService.detectChanges(this._cdr);
      });
    }

    searchMeetingReportTemeplate(event){
  
      this._meetingReportTemplatesService.getSearchItems('status=active&q='+event.term).subscribe(res=>{
        if(ReportStore.editFlag){
          for (let item of res.data) {
            if (this.reportObject.values.meeting_report_template_id == item.id) {
              this.form.patchValue({ meeting_report_templated_id: item });
            }
          }
        }
        this._utilityService.detectChanges(this._cdr);
      });
    }

    getButtonText(text){
      return this._helperService.translateToUserLanguage(text);
    }
  
    cancel() {
      this.closeFormModal('cancel');
    }
  
    closeFormModal(type,resId?) {
      AppStore.disableLoading();
      this.resetForm();
      if(resId){
        this._router.navigateByUrl('mrm/meeting-reports/'+resId);
      }
      this._eventEmitterService.dismissCommonModal(type);
    }
  
    resetForm() {
      this.form.reset();
      this.form.pristine;
      this.formErrors = null;
    }
  
    getSaveData(){

      if (ReportStore.editFlag){
        this.saveData = {
          title: this.form.value.title ? this.form.value.title : '',    
          meeting_id: this.reportObject.values?.meeting_id ? this.reportObject.values.meeting_id  : null,
          meeting_report_template_id:  this.form.value?.meeting_report_templated_id ? this.form.value.meeting_report_templated_id.id  : null,
        }
      } else{
        this.saveData = {
          title: this.form.value.title ? this.form.value.title : '',    
          meeting_id: this.form.value?.meeting_id ? this.form.value.meeting_id.id : null,
          meeting_report_template_id:  this.form.value?.meeting_report_templated_id ? this.form.value.meeting_report_templated_id.id : null
        }  
      }
    }
  
    save(close: boolean = false) {
      if (this.form.value) {
  
        let save;
        AppStore.enableLoading();
  
        this.getSaveData();
  
        if (this.form.value.id) {
          save = this._reportService.updateItem(this.form.value.id,this.saveData);
        } else {
          save = this._reportService.saveItem(this.saveData);
        }
        save.subscribe(
          (res: any) => {
            this.resetForm();
            AppStore.disableLoading();
            this._utilityService.detectChanges(this._cdr);
            if (close) this.closeFormModal('save',res.id);
          },
          (err: HttpErrorResponse) => {
            AppStore.disableLoading();
            if (err.status == 422) {
              this.formErrors = err.error.errors;
            } else {
              this._utilityService.showErrorMessage('error','something_went_wrong_try_again');
            }
            this._utilityService.detectChanges(this._cdr);
          }
        );
      }
    }
  
    ngOnDestroy() {
      if (this.reactionDisposer) this.reactionDisposer();
      this.resetForm();
      MeetingsStore.unSetMeetings();//meeting list
      MeetingReportTemeplates.unsetMeetingReportTemplatesList(); //template list
    }
  
}
