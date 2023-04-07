import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MeetingReportTemplatesService } from 'src/app/core/services/mrm/meeting-report-templates/meeting-report-templates.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { MeetingReportTemeplates } from 'src/app/stores/mrm/meeting-report-templates/meeting-report-templates';

@Component({
  selector: 'app-meeting-report-templates-add',
  templateUrl: './meeting-report-templates-add.component.html',
  styleUrls: ['./meeting-report-templates-add.component.scss']
})
export class MeetingReportTemplatesAddComponent implements OnInit {

  @Input('source') reportSource: any;

  form: FormGroup;
  formErrors: any;
  saveData: any = null;

  AppStore = AppStore;
  MeetingReportTemeplates = MeetingReportTemeplates;

  constructor(
    private _router: Router,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _meetingReportTemplatesService:MeetingReportTemplatesService,
  ) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    AppStore.disableLoading();

    this.form = this._formBuilder.group({
      id: [""],
      title: ["", [Validators.required, Validators.maxLength(255)]],
    });
    this.resetForm();

    if(this.reportSource.values){
        this.setEditDetails();
    }
  }

  setEditDetails(){
    this.form.setValue({
      id: this.reportSource.values.id,
      title: this.reportSource.values.title?this.reportSource.values.title:'',
    })
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  cancel() {
    this.closeFormModal();
  }

  closeFormModal(type?) {
    AppStore.disableLoading();
    this.resetForm();
    this._eventEmitterService.dismissCommonModal(type);
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
  }

  getSaveData(){
    this.saveData = {

      id: this.form.value.id ? this.form.value.id : null,
      title: this.form.value.title ? this.form.value.title : '',
    }
  }

  save(close: boolean = false) {
    if (this.form.value) {

      // this.displayForm = this.form.value;
      let save;
      AppStore.enableLoading();

      this.getSaveData();

      if (this.form.value.id) {

        save = this._meetingReportTemplatesService.updateItem(this.form.value.id,this.saveData);
      } else {
        save = this._meetingReportTemplatesService.saveItem(this.saveData);
      }
      save.subscribe(
        (res: any) => {
          this.resetForm();
          AppStore.disableLoading();
          if (close) {
            this.closeFormModal(close);
            this._router.navigateByUrl('mrm/meeting-report-templates/' + res['id']);
          }
          this._utilityService.detectChanges(this._cdr);
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
}
