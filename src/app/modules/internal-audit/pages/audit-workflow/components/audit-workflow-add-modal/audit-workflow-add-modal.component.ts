import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { SectionMasterStore } from 'src/app/stores/masters/organization/section-store';
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
import { AppStore } from 'src/app/stores/app.store';
import { AuditWorkflowService } from 'src/app/core/services/internal-audit/audit-workflow/audit-workflow.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AuditCategoryMasterStore } from 'src/app/stores/masters/internal-audit/audit-categories-store';
import { AuditCategoriesService } from 'src/app/core/services/masters/internal-audit/audit-categories/audit-categories.service';
import { AuditWorkflowStore } from 'src/app/stores/internal-audit/audit-workflow/audit-workflow-store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

@Component({
  selector: 'app-audit-workflow-add-modal',
  templateUrl: './audit-workflow-add-modal.component.html',
  styleUrls: ['./audit-workflow-add-modal.component.scss']
})
export class AuditWorkflowAddModalComponent implements OnInit {
  @Input('source') WorkFlowSource: any;

  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  AuditCategoryStore = AuditCategoryMasterStore;
  AuditWorkFlowStore = AuditWorkflowStore;
  moduleGroup = [];
  moduleGroupId: any;
  auditWorkflowSubHead
  constructor(
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _formBuilder: FormBuilder,
    private _auditWorkflowService: AuditWorkflowService,
    private _eventEmitterService: EventEmitterService,
    private _auditCategoryService: AuditCategoriesService,
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      module_id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      audit_category_ids: [[Validators.required]],
    });
    this.resetForm()
    if (this.WorkFlowSource) {
      if(this.WorkFlowSource.module_id){
        this.moduleGroupId = this.WorkFlowSource.module_id
      }

      if (this.WorkFlowSource.hasOwnProperty('values') && this.WorkFlowSource.values) {
        let { id, title, audit_categories, module_ids, description} = this.WorkFlowSource.values

        this.form.setValue({
          id: id,
          module_id: module_ids ? module_ids :'',
          title: title ? title : '',
          audit_category_ids: audit_categories ? audit_categories : [],
        })
        this.auditWorkflowSubHead = description
        setTimeout(() => {
          this.auditCategoryList();
          this._utilityService.detectChanges(this._cdr);
        }, 1000);
      } else {
        // this.setInitialOrganizationLevels();
      }
    }
    this.getModuleData()
  }

  getModuleData() {
    this._auditWorkflowService.getModuleItems('?module_group_ids='+1000+'&is_workflow=true').subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

  auditCategoryList(newPage: number = null) {
    if (newPage) AuditCategoryMasterStore.setCurrentPage(newPage);
    this._auditCategoryService.getItems(false, null).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchCategory(event) {
    let params = '';
    if (this.form.get('audit_category_ids').value) {
      params = '&audit_category_ids=' + this.arayyToStringConversion(this.form.get('audit_category_ids').value);
      this._auditCategoryService.getItems(false, '&q=' + event.term + params).subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  save(close: boolean = false) {
    let saveData = {
      "module_id": this.form.value.module_id ? this.form.value.module_id : '',
      "title": this.form.value.title ? this.form.value.title : '',
      "audit_category_ids": this.form.value.audit_category_ids ? this.form.value.audit_category_ids : [],
      "description":this.auditWorkflowSubHead ? this.auditWorkflowSubHead:''
    };
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
        save = this._auditWorkflowService.updateItem(this.form.value.id, saveData);
      } else {
        delete this.form.value.id
        save = this._auditWorkflowService.saveItem(saveData);
      }
      save.subscribe((res: any) => {
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
        } else if (err.status == 500 || err.status == 403) {
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

  close() {
    this.resetForm();
    this._eventEmitterService.dismissAuditWorkflowModal()
  }

  arayyToStringConversion(paramsArray) {
    if (paramsArray && paramsArray.length > 0) {
      let paramsString = paramsArray.reduce((p, c) => {
        p += (p != '') ? ',' + c : c;
        return p;
      }, [])
      return paramsString;
    }
    else {
      return '';
    }
  }

  // for resetting the form
  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    this.auditWorkflowSubHead = '';
    AppStore.disableLoading();
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

}
