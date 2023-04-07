import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { IncidentTemplateService } from 'src/app/core/services/incident-management/incident-template/incident-template.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';

@Component({
  selector: 'app-add-template-modal',
  templateUrl: './add-template-modal.component.html',
  styleUrls: ['./add-template-modal.component.scss']
})
export class AddTemplateModalComponent implements OnInit {
  @Input('source') incidentTemplateSource: any;
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;


  constructor( private _formBuilder: FormBuilder,  private _cdr: ChangeDetectorRef,
    private _router:Router, private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,private _templateService : IncidentTemplateService,
    private _helperService:HelperServiceService,

    ) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
    });
    this.resetForm()
    if (this.incidentTemplateSource) {
      if (this.incidentTemplateSource.hasOwnProperty('values') && this.incidentTemplateSource.values) {
        
        this.form.setValue({
          id: this.incidentTemplateSource.values.id,
          title: this.incidentTemplateSource.values.title,
          description: this.incidentTemplateSource.values.description,
        })
      }
    }
  }

  processDataForSave() {
    let saveData = {
      "id": this.form.value.id ? this.form.value.id : '',
      "title": this.form.value.title ? this.form.value.title : '',
      "description": this.form.value.description ? this.form.value.description : '',
    }
    return saveData;
  }

  save(close: boolean = false) {
    this.formErrors = null;

    if (this.form.value) {
      let save;
      AppStore.enableLoading();

      if (this.form.value.id) {
        save = this._templateService.updateItem(this.form.value.id, this.processDataForSave());
      } else {
        delete this.form.value.id
        save = this._templateService.addTemplate(this.processDataForSave());
      }

      save.subscribe((res: any) => {
        // this.res_id = res.id;// assign id to variable;
        // AuditTemplateStore.templateId = res.id;
        // this._router.navigateByUrl('/internal-audit/audit-report-template/'+AuditTemplateStore.templateId)
        if (!this.form.value.id) {
          this.resetForm();
        }
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
       
        if (close){
          this.close();
          this._router.navigateByUrl('/incident-management/incident-report-templates/'+res.id)
        } 
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        } else if(err.status == 500 || err.status == 403){
          this.cancel();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);

      });
    }
  }

  cancel() {
    this.close();
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  
  close() {
    this.resetForm();
    this._eventEmitterService.dismissIncidentTemplateModal()
  }

}
