import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditService } from 'src/app/core/services/internal-audit/audit/audit.service';
import { AuditReportService } from 'src/app/core/services/internal-audit/report/report/audit-report.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuditStore } from 'src/app/stores/internal-audit/audit/audit-store';
@Component({
  selector: 'app-generate-report-modal',
  templateUrl: './generate-report-modal.component.html',
  styleUrls: ['./generate-report-modal.component.scss']
})
export class GenerateReportModalComponent implements OnInit {
  form: FormGroup;
  AuditStore = AuditStore;
  AppStore = AppStore;
  formErrors: any;
  constructor( private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _helperService: HelperServiceService,
    private _auditReportService: AuditReportService,
    private _utilityService: UtilityService,
    private _auditService: AuditService) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required]],
      description: [''],
      // is_workflow: false,
      audit_id: [null,[Validators.required]]
    });
    this.Audits(1)
    
  }



  Audits(newPage: number = null) {
    let params = '&is_generate_report=false';
    if (newPage) AuditStore.setCurrentPage(newPage);
    this._auditService.getItems(false,params).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchAudits(event){
    let params = '&is_generate_report=false';
    this._auditService.getItems(false,'&q='+event.term+params).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  auditChange(e){
    if(this.form.value.audit_id){
    this.form.patchValue({
      title: this.form.value.audit_id.audit_title
    })
  } else {
    this.form.controls["title"].reset();
  }
  }

  processDataForSave(){
    var data = {
      title: this.form.value.title,
      description:this.form.value.description,
      audit_id: this.form.value.audit_id.id,
      // is_workflow: this.form.value.is_workflow
    }

    return data;
  }

  save(close:boolean = false){
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
        save = this._auditReportService.saveItem(this.processDataForSave());
      save.subscribe((res: any) => {
         if(!this.form.value.id){
         this.resetForm();}
        AppStore.disableLoading();
        this._router.navigateByUrl("/internal-audit/audit-reports/"+res.id);
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.close();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;}
          else if(err.status == 500 || err.status == 403){
            this.close();
          }
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        
      });
    }
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  close() {
    this.resetForm();
    this._eventEmitterService.dismissGenerateAuditReportModalControl()
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

}
