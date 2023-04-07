import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppStore } from 'src/app/stores/app.store';
import { AuditWorkflowStore } from 'src/app/stores/internal-audit/audit-workflow/audit-workflow-store';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { SectionMasterStore } from 'src/app/stores/masters/organization/section-store';
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { SubsidiaryService } from 'src/app/core/services/organization/business_profile/subsidiary/subsidiary.service';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { SubSectionService } from 'src/app/core/services/masters/organization/sub-section/sub-section.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { OrganizationModulesService } from 'src/app/core/services/settings/organization-modules/organization-modules.service';
import { AuditWorkflowService } from 'src/app/core/services/internal-audit/audit-workflow/audit-workflow.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DesignationMasterStore } from 'src/app/stores/masters/human-capital/designation-master.store';
import { DesignationService } from 'src/app/core/services/masters/human-capital/designation/designation.service';

@Component({
  selector: 'app-audit-workflow-designation-add-modal',
  templateUrl: './audit-workflow-designation-add-modal.component.html',
  styleUrls: ['./audit-workflow-designation-add-modal.component.scss']
})
export class AuditWorkflowDesignationAddModalComponent implements OnInit {
  @Input('source') WorkFlowSource: any;

  form: FormGroup;
  formErrors: any;
  DepartmentMasterStore = DepartmentMasterStore;
  AppStore = AppStore;
  AuditWorkFlowStore = AuditWorkflowStore;
  OrganizationModulesStore = OrganizationModulesStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  DivisionMasterStore = DivisionMasterStore;
  SubsidiaryStore = SubsidiaryStore;
  SectionMasterStore = SectionMasterStore;
  SubSectionMasterStore = SubSectionMasterStore;
  DesignationMasterStore = DesignationMasterStore;

  constructor(
    private _formBuilder: FormBuilder,
    private _helperService: HelperServiceService,
    private _divisionService: DivisionService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _subsiadiaryService: SubsidiaryService,
    private _sectionService: SectionService,
    private _departmentService: DepartmentService,
    private _subSectionService: SubSectionService,
    private _auditWorkflowService: AuditWorkflowService,
    private _eventEmitterService: EventEmitterService,
    private _organizationModuleService: OrganizationModulesService,
    private _designationService: DesignationService,
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      level: [''],
      designation_id: ['',[Validators.required]],
      department_ids: [[Validators.required]]
    });
    this.resetForm()
    this.getDesignatios();
    this.getDepartment();
  }

  getDepartment() {
    this._departmentService.getItems().subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getDesignatios(newPage: number = null) {
    if (newPage) DesignationMasterStore.setCurrentPage(newPage);
    this._designationService.getItems(false, null, true)
      .subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  save(close: boolean = false) {
    let saveData = {
      "level": this.WorkFlowSource.values ? this.WorkFlowSource.values.level : '',
      "designation_id": this.form.value.designation_id ? this.form.value.designation_id : '',
      "department_id": this.form.value.department_ids ? this.form.value.department_ids : '',
    };
    this.formErrors = null;

    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
        // save = this._auditWorkflowService.updateItem(this.form.value.id, saveData);
      } else {
        delete this.form.value.id
        save = this._auditWorkflowService.saveDesignationAdd(saveData,this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
      }

      save.subscribe((res: any) => {
        // this.res_id = res.id;// assign id to variable;
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
    this._eventEmitterService.dismissAuditWorkflowDesignationAddModal()
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

}
