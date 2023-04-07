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
import { WorkflowService } from 'src/app/core/services/knowledge-hub/work-flow/workflow.service';
import { RiskWorkflowService } from 'src/app/core/services/risk-management/risk-workflow/risk-workflow.service';
import { MrmWorkflowService } from 'src/app/core/services/mrm/mrm-workflow/mrm-workflow.service';
import { ComplianceWorkflowService } from 'src/app/core/services/compliance-management/compliance-workflow/compliance-workflow.service';
import { BcpWorkflowService } from 'src/app/core/services/bcm/bcp-workflow/bcp-workflow.service';
import { StrategyWorkflowService } from 'src/app/core/services/strategy-management/strategy-workflow/strategy-workflow.service';
import { IsmsRiskWorkflowService } from 'src/app/core/services/isms/isms-risk-workflow/isms-risk-workflow.service';
import { ProjectWorkflowServiceService } from 'src/app/core/services/project-monitoring/project-monitoring-workflow/project-workflow-service.service';
import { KpiWorkflowService } from 'src/app/core/services/kpi-management/kpi-workflow/kpi-workflow.service';
import { AmWorkflowService } from 'src/app/core/services/audit-management/am-workflow/am-workflow.service';
import { EventWorkflowService } from 'src/app/core/services/event-monitoring/event-workflow/event-workflow.service';
import { MsAuditWorkflowService } from 'src/app/core/services/ms-audit-management/audit-workflow/audit-workflow.service';
import { MockDrillWorkflowService } from 'src/app/core/services/mock-drill/mock-drill-workflow/mock-drill-workflow.service';
import { CyberIncidentWorkflowService } from 'src/app/core/services/cyber-incident/cyber-incident-workflow/cyber-incident-workflow.service';

@Component({
  selector: 'app-workflow-designation-modal',
  templateUrl: './workflow-designation-modal.component.html',
  styleUrls: ['./workflow-designation-modal.component.scss']
})
export class WorkflowDesignationModalComponent implements OnInit {

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
    private _khWorkflowService: WorkflowService,
    private _riskWorkflowService: RiskWorkflowService,
    private _complianceWorkflowService: ComplianceWorkflowService,
    private _mrmWorkflowService: MrmWorkflowService,
    private _bcpWorkflowService: BcpWorkflowService,
    private _strategyWorkflowService: StrategyWorkflowService,
    private _ismsRiskWorkflowService: IsmsRiskWorkflowService,
    private _projectWorkflowService: ProjectWorkflowServiceService,
    private _kpiWorkflowService: KpiWorkflowService,
    private _amWorkflowService: AmWorkflowService,
    private _eventWorkflowService: EventWorkflowService,
    private _msAuditWorkflowService: MsAuditWorkflowService,
    private _mockDrillWorkflowService: MockDrillWorkflowService,
    private _cyberIncidentWorkflowService: CyberIncidentWorkflowService
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      level: [''],
      designation_id: ['', [Validators.required]],
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

  searchDepartment(e) {
    this._departmentService.getItems(false, '&q=' + e.term).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getDesignatios(newPage: number = null) {
    if (newPage) DesignationMasterStore.setCurrentPage(newPage);
    this._designationService.getItems(false)
      .subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchDesignations(e) {
    this._designationService.getItems(false, '&q=' + e.term)
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
        // save = this._auditWorkflowService.saveDesignationAdd(saveData,this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
        switch (this.WorkFlowSource.values.module) {
          case 'IA':
            save = this._auditWorkflowService.saveDesignationAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;

          case 'KH':
            save = this._khWorkflowService.saveDesignationAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;

          case 'RM':
            save = this._riskWorkflowService.saveDesignationAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;

          case 'MRM':
            save = this._mrmWorkflowService.saveDesignationAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;

          case 'KPI':
            save = this._kpiWorkflowService.saveDesignationAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;

          case 'CM':
            save = this._complianceWorkflowService.saveDesignationAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;

          case 'BCM':
            save = this._bcpWorkflowService.saveDesignationAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;

          case 'Strategy_Module':
            save = this._strategyWorkflowService.saveDesignationAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;
          case 'ISMS':
            save = this._ismsRiskWorkflowService.saveDesignationAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;

          case 'Project_Monitoring_Module':
            save = this._projectWorkflowService.saveDesignationAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;

          case 'CI':
            save = this._cyberIncidentWorkflowService.saveDesignationAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;

          case 'AM':
            save = this._amWorkflowService.saveDesignationAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;
          case 'EM':
            save = this._eventWorkflowService.saveDesignationAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;
          case 'Ms_Audit':
            save = this._msAuditWorkflowService.saveDesignationAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;
          case 'MOCK_DRILL':
            save = this._mockDrillWorkflowService.saveDesignationAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;

          default:
            break;
        }
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
    this._eventEmitterService.dismissWorkflowDesignationAddModal()
    this._eventEmitterService.setModalStyle()
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
