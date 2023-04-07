import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { IncidentTemplateService } from 'src/app/core/services/incident-management/incident-template/incident-template.service';
import { InvestigationService } from 'src/app/core/services/incident-management/investigation/investigation.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';
import { IncidentTemplateStore } from 'src/app/stores/incident-management/template/incident-template-store';
import { IncidentReportService } from 'src/app/core/services/incident-management/report/incident-report.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { IncidentReportStore } from 'src/app/stores/incident-management/report/incident-report.store';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-report-modal',
  templateUrl: './add-report-modal.component.html',
  styleUrls: ['./add-report-modal.component.scss']
})
export class AddReportModalComponent implements OnInit {
  form: FormGroup;
  AppStore = AppStore;
  IncidentInvestigationStore = IncidentInvestigationStore
  IncidentTemplateStore = IncidentTemplateStore
  IncidentReportStore = IncidentReportStore
  formErrors: any;
  constructor(private _investigationService : InvestigationService, private _templateService : IncidentTemplateService,
              private _utilityService: UtilityService, private _cdr: ChangeDetectorRef, private _formBuilder: FormBuilder,
              private _helperService: HelperServiceService, private _incidentReportService : IncidentReportService,
              private _eventEmitterService: EventEmitterService, private _router:Router


    ) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required]],
      incident_investigation_id: [null,[Validators.required]],
      incident_report_template_id: [null,[Validators.required]]

    });

    if (this._router.url.indexOf('report-list') != -1) {
      // IncidentReportStore.setSubMenuHide(true);
        this.form.patchValue({
          incident_investigation_id: IncidentInvestigationStore.selectedId? IncidentInvestigationStore.selectedId : ''
        })
        this.searchInvestigation({term:IncidentInvestigationStore.selectedId});
        // this.getInvestigation()
        this._utilityService.detectChanges(this._cdr);
  
    }
    this.getInvestigation()
    this.getIncidentTemplates();
  }

  // changeIncidentItem(){
  //   let id
  //   if(this._router.url.indexOf('corrective-actions-list') != -1) {
  //     id = IncidentStore.selectedId
  //   }else{
  //    id = this.form.value.incident_id
  //   }
  //   this._incidentService.getItem(id).subscribe(res=>{
  //     this.showIncidentDetails = true
  //     this._utilityService.detectChanges(this._cdr);
  
  // })
  
  // }

  getIncidentTemplates(){
    this._templateService.getItems().subscribe()
  }

  getInvestigation(){
    this._investigationService.getAllinvestigation().subscribe(res=> this._utilityService.detectChanges(this._cdr)
    )
  }

  searchInvestigation(e){

    this._investigationService.getAllinvestigation(false,'&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchTemplate(e){
    this._templateService.getItems(false,'&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  save(close:boolean = false){
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
         save = this._incidentReportService.updateReport(this.form.value.id, this.processData());
      } else {
        delete this.form.value.id
        save = this._incidentReportService.saveReport(this.processData());
      }
      save.subscribe((res: any) => {
        if (!this.form.value.id) {
          // this.resetForm();
        }
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);

        if (close) this.close();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        } else if (err.status == 500 || err.status == 403) {
          this.cancel();
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
    // this.auditWorkflowSubHead = '';
    AppStore.disableLoading();
  }

  cancel() {
    this.close();
  }
  close() {
    this.resetForm();
    this._eventEmitterService.dismissIncidenReportAddModal()
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  processData(){
    
    let saveData = {
      // "module_id": this.form.value.module_id ? this.form.value.module_id : '',
      "title": this.form.value.title ? this.form.value.title : '',
      "incident_investigation_id": this.form.value.incident_investigation_id ? this.form.value.incident_investigation_id : [],
      "incident_report_template_id": this.form.value.incident_report_template_id ? this.form.value.incident_report_template_id.id : [],

    };

    return saveData;
  }

 

}
