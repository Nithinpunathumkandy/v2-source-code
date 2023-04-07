import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditProgramReportService } from 'src/app/core/services/ms-audit-management/audit-program-report/audit-program-report.service';
import { AuditReportService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/audit-report/audit-report.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import * as myCkEditor from 'src/assets/build/ckeditor';

@Component({
  selector: 'app-audit-program-report-update-modal',
  templateUrl: './audit-program-report-update-modal.component.html',
  styleUrls: ['./audit-program-report-update-modal.component.scss']
})
export class AuditProgramReportUpdateModalComponent implements OnInit {

  @Input('source')reportData


  AppStore=AppStore;

  auditReportForm:FormGroup;
  auditReportFormErrors:any;

  public Editor;
  config = {
    toolbar: [
      'bulletedList',
      'numberedList',
    ],
    language: 'id',
   
  };

  constructor(
    private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _auditReportService:AuditProgramReportService

  ) { 
    this.Editor = myCkEditor;
  }

  ngOnInit(): void {

    // this.resetForm()
    this.auditReportForm = this._formBuilder.group({
      id: [''],
      // title: ['',[Validators.required, Validators.maxLength(255)]],
      description: [''],
    })


    if (this.reportData.hasOwnProperty('values') && this.reportData.values) 
    this.setSummaryData()

  }

  setSummaryData(){
    this.auditReportForm.patchValue({
      id:this.reportData.values?.id?this.reportData.values.id:null,
      description:this.reportData.values?.id?this.reportData.values.description:''
    })
  }


  save(close:boolean=false){
    this.auditReportFormErrors=null;
    if (this.auditReportForm.value) {

      let save
      AppStore.enableLoading();

      if (this.auditReportForm.value.id) {
        save = this._auditReportService.updateReport(this.auditReportForm.value)
      } 
      save.subscribe((res: any) => {
         this.resetForm()
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeAuditReport();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.auditReportFormErrors = err.error.errors;
          this._utilityService.detectChanges(this._cdr);
          AppStore.disableLoading();
        }
      });
    }
  }

  closeAuditReport(){
    this._eventEmitterService.dismissAuditProgramReportModal()
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

    //ckeditor
    descriptionValueChange(event) {
      this._utilityService.detectChanges(this._cdr);
    }

    getDescriptionLength() {
      var regex = /(<([^>]+)>)/ig;
      var result = this.auditReportForm.value.description.replace(regex, "");
      return result.length;
    }


  resetForm() {

    this.auditReportForm.reset();
    this.auditReportForm.pristine;
    this.auditReportForm = null;
  }
}
