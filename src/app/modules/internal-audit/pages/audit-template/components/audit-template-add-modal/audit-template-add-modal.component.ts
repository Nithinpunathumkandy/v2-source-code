import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Input, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditTemplateService } from 'src/app/core/services/internal-audit/audit-template/audit-template.service';
import { AuditCategoriesService } from 'src/app/core/services/masters/internal-audit/audit-categories/audit-categories.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuditCategoryMasterStore } from 'src/app/stores/masters/internal-audit/audit-categories-store';
import { AuditFindingCategoryMasterStore } from 'src/app/stores/masters/internal-audit/audit-finding-categories-store';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { AuditTemplateStore } from 'src/app/stores/internal-audit/audit-template/audit-template-store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-audit-template-add-modal',
  templateUrl: './audit-template-add-modal.component.html',
  styleUrls: ['./audit-template-add-modal.component.scss']
})
export class AuditTemplateAddModalComponent implements OnInit {
  @Input('source') AuditTemplateSource: any;
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  AuditFindingCategoryStore = AuditFindingCategoryMasterStore;
  AuditCategoryStore = AuditCategoryMasterStore;
  constructor(
    private _eventEmitterService: EventEmitterService,
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _router:Router,
    private _utilityService: UtilityService,
    private _auditTemplateService:AuditTemplateService,
    private _helperService:HelperServiceService,
    private _auditCategoryService: AuditCategoriesService,
    private _divisionService: DivisionService,
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      audit_category_ids: [[],[Validators.required]],
    });
    this.resetForm()

    if (this.AuditTemplateSource) {
      if (this.AuditTemplateSource.hasOwnProperty('values') && this.AuditTemplateSource.values) {
        
        this.form.setValue({
          id: this.AuditTemplateSource.values.id,
          title: this.AuditTemplateSource.values.title,
          description: this.AuditTemplateSource.values.description,
          audit_category_ids:this.AuditTemplateSource.values.audit_category_ids,
        })
      }
    }
    this.auditCategoryList();
  }

  auditCategoryList(newPage: number = null) {
    if (newPage) AuditCategoryMasterStore.setCurrentPage(newPage);
    this._auditCategoryService.getItems(false,null).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  processDataForSave() {
    let saveData = {
      "id": this.form.value.id ? this.form.value.id : '',
      "title": this.form.value.title ? this.form.value.title : '',
      "description": this.form.value.description ? this.form.value.description : '',
      "audit_category_ids": this.form.value.audit_category_ids?this.form.value.audit_category_ids : '',
    }
    return saveData;
  }

  searchCategory(event) {
    let params = '';
    if (this.form.get('audit_category_ids').value) {
      params = '&audit_category_ids=' + this._helperService.createParameterFromArray(this.form.get('audit_category_ids').value);

      this._auditCategoryService.getItems(false, '&q=' + event.term + params).subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  save(close: boolean = false) {
    this.formErrors = null;

    if (this.form.value) {
      let save;
      AppStore.enableLoading();

      if (this.form.value.id) {
        save = this._auditTemplateService.updateItem(this.form.value.id, this.processDataForSave());
      } else {
        delete this.form.value.id
        save = this._auditTemplateService.saveItem(this.processDataForSave());
      }

      save.subscribe((res: any) => {
        // this.res_id = res.id;// assign id to variable;
        AuditTemplateStore.templateId = res.id;
        this._router.navigateByUrl('/internal-audit/audit-report-template/'+AuditTemplateStore.templateId)
        if (!this.form.value.id) {
          this.resetForm();
        }
       
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
       
        if (close) this.close();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
          this.processFormErrors();
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

  close() {
    this.resetForm();
    this._eventEmitterService.dismissTemplateModal()
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  processFormErrors(){
    var errors = this.formErrors;
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
        if(key.startsWith('audit_category_ids')){
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['audit_category_ids'] = this.formErrors['audit_category_ids']? 
          this.formErrors['audit_category_ids'] + errors[key] + '('+(errorPosition + 1)+')'
          : errors[key]+ (errorPosition + 1);
        }
      }
    }
    this._utilityService.detectChanges(this._cdr);
  }

}
