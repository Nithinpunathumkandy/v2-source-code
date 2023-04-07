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
  selector: 'app-workflow-head-unit-add-modal',
  templateUrl: './workflow-head-unit-add-modal.component.html',
  styleUrls: ['./workflow-head-unit-add-modal.component.scss']
})
export class WorkflowHeadUnitAddModalComponent implements OnInit {

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
      workflow_id: [''],
      level: [''],
      // sub_section_ids: [null],
      section_ids: [null],
      organization_ids: [null],
      division_ids: [null],
      department_ids: [null],
      type: ['', [Validators.required]]
    });
    // if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary)
    //   this.form.controls['organization_ids'].setValidators(Validators.required);


    this.resetForm()
    this.getOrganization();
  }

  headUnitType() {
    let headUnitType
    if (this.form.value.organization_ids && !this.form.value.department_ids && !this.form.value.division_ids && !this.form.value.section_ids) {
      headUnitType = "subsidiary-head"
    }
    if (this.form.value.organization_ids && this.form.value.division_ids && !this.form.value.department_ids && !this.form.value.section_ids) {
      headUnitType = "division-head"
    }
    if (this.form.value.organization_ids && this.form.value.division_ids && this.form.value.department_ids && !this.form.value.section_ids) {
      headUnitType = "department-head"
    }
    if (this.form.value.organization_ids && this.form.value.division_ids && this.form.value.department_ids && this.form.value.section_ids) {
      headUnitType = "section-head"
    }
    if (this.form.value.division_ids && !this.form.value.department_ids && !this.form.value.section_ids) {
      headUnitType = "division-head"
    }
    if (this.form.value.division_ids && this.form.value.department_ids && !this.form.value.section_ids) {
      headUnitType = "department-head"
    }
    if (this.form.value.division_ids && this.form.value.department_ids && this.form.value.section_ids) {
      headUnitType = "section-head"
    }
    if (this.form.value.department_ids && !this.form.value.section_ids) {
      headUnitType = "department-head"
    }
    if (this.form.value.department_ids && this.form.value.section_ids) {
      headUnitType = "section-head"
    }
    if (this.form.value.section_ids) {
      headUnitType = "section-head"
    }
    // if (this.form.value.organization_ids && this.form.value.division_ids && this.form.value.department_ids && this.form.value.section_ids && this.form.value.sub_section_ids) {
    //   headUnitType = "sub-section-head"
    // }

    return headUnitType
  }

  save(close: boolean = false) {
    this.formErrors = null;
    let saveData = {
      "level": this.WorkFlowSource.values ? this.WorkFlowSource.values.level : '',
      "department_id": this.form.value.department_ids ? this.form.value.department_ids : '',
      "division_id": this.form.value.division_ids ? this.form.value.division_ids : '',
      "organization_id": this.form.value.organization_ids ? this.form.value.organization_ids : '',
      "section_id": this.form.value.section_ids ? this.form.value.section_ids : '',
      "type": this.headUnitType()
    };
    this.formErrors = null;

    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
      } else {
        delete this.form.value.id
        // save = this._auditWorkflowService.saveHeadOfUnitAdd(saveData,this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
        switch (this.WorkFlowSource.values.module) {
          case 'IA':
            save = this._auditWorkflowService.saveHeadOfUnitAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;

          case 'KH':
            save = this._khWorkflowService.saveHeadOfUnitAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;

          case 'RM':
            save = this._riskWorkflowService.saveHeadOfUnitAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;

          case 'MRM':
            save = this._mrmWorkflowService.saveHeadOfUnitAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;

          case 'KPI':
            save = this._kpiWorkflowService.saveHeadOfUnitAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;

          case 'CM':
            save = this._complianceWorkflowService.saveHeadOfUnitAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;

          case 'BCM':
            save = this._bcpWorkflowService.saveHeadOfUnitAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;
          case 'Strategy_Module':
            save = this._strategyWorkflowService.saveHeadOfUnitAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;
          case 'ISMS':
            save = this._ismsRiskWorkflowService.saveHeadOfUnitAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;

          case 'Project_Monitoring_Module':
            save = this._projectWorkflowService.saveHeadOfUnitAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;

          case 'CI':
              save = this._cyberIncidentWorkflowService.saveHeadOfUnitAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
              break;

          case 'AM':
            save = this._amWorkflowService.saveHeadOfUnitAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;

          case 'EM':
            save = this._eventWorkflowService.saveHeadOfUnitAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;

          case 'Ms_Audit':
            save = this._msAuditWorkflowService.saveHeadOfUnitAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;

          case 'MOCK_DRILL':
            save = this._mockDrillWorkflowService.saveHeadOfUnitAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;
          default:
            break;
        }
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
    this._eventEmitterService.dismissWorkflowHeadUnitAddModal()
    this._eventEmitterService.setModalStyle()
  }

  searchDepartment(event) {
    let params = '';
    // if (this.form.get('organization_ids').value) {
    //   params = '&division_ids=' + this.arayyToStringConversion(this.form.get('division_ids').value);
    //   if (this.form.get('division_ids').value) {
    //     if (params)
    //       params = params + '&division_ids=' + this.arayyToStringConversion(this.form.get('division_ids').value);
    //     else
    //       params = '&division_ids=' + this.arayyToStringConversion(this.form.get('division_ids').value);
    //   }
    if (this.form.get('organization_ids').value) {
      params = params + '&organization_ids=' + this.form.get('organization_ids').value
    }
    if (this.form.get('division_ids').value) {
      params = params + '&division_ids=' + this.form.get('division_ids').value
    }

    this._departmentService.getItems(false, '&q=' + event.term + params).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
    // }
  }

  getDepartment() {
    let params = '';
    if (this.form.get('organization_ids').value) {
      params = params + '&organization_ids=' + this.form.get('organization_ids').value
    }
    if (this.form.get('division_ids').value) {
      params = params + '&division_ids=' + this.form.get('division_ids').value
    }

    DepartmentMasterStore.setAllDepartment([]);


    this._departmentService.getItems(false, params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }
  getSection() {

    var params = '';
    if (this.form.get('organization_ids').value) {
      params = params + '&organization_ids=' + this.form.get('organization_ids').value
    }
    if (this.form.get('division_ids').value) {
      params = params + '&division_ids=' + this.form.get('division_ids').value
    }
    if (this.form.get('department_ids').value) {
      params = params + '&department_ids=' + this.form.get('department_ids').value
    }


    SectionMasterStore.setAllSection([]);

    this._sectionService.getItems(false, params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

  }
  searchSection(event) {
    var params = '';
    if (this.form.get('organization_ids').value) {
      params = params + '&organization_ids=' + this.form.get('organization_ids').value
    }
    if (this.form.get('division_ids').value) {
      params = params + '&division_ids=' + this.form.get('division_ids').value
    }
    if (this.form.get('department_ids').value) {
      params = params + '&department_ids=' + this.form.get('department_ids').value
    }
    this._sectionService.getItems(false, params + '&q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

  }
  searchDivision(event) {
    let params = '';
    // if (this.form.get('organization_ids').value) {
    //   params = '&organization_ids=' + this.arayyToStringConversion(this.form.get('organization_ids').value);
    // }
    if (this.form.get('organization_ids').value) {
      params = params + '&organization_ids=' + this.form.get('organization_ids').value
    }
    this._divisionService.getItems(false, '&q=' + event.term + params).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

  getOrganization() {
    this._subsiadiaryService.getAllItems(false).subscribe((res: any) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchOrganization(event) {
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
      this._subsiadiaryService.getAllItems(false, '&q=' + event.term).subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  getDivision() {
    let params = '';
    // if (this.form.value.organization_ids)params = '&organization_ids=' + this.arayyToStringConversion(this.form.value.organization_ids);
    if (this.form.get('organization_ids').value) {
      params = params + '&organization_ids=' + this.form.get('organization_ids').value
    }
    DivisionMasterStore.setAllDivision([]);

    this._divisionService.getItems(false, params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

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
      return paramsArray;
    }
  }

  handleDropDownClear(type) {
    switch (type) {
      case 'organization_id': this.form.controls['division_ids'].reset();
        this.form.controls['department_ids'].reset();
        break;
      case 'division_id': this.form.controls['department_ids'].reset();
        break;
      case 'department_id': this.form.controls['section_ids'].reset();
        break;
      default: '';
        break;
    }
  }

  handleDropDownItemClear(event, type) {
    switch (type) {
      case 'organization_id': if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
        this.checkDivision(event.value.id, type);
        this.checkDepartment(event.value.id, type);

        break;
      case 'division_id': this.checkDepartment(event.value.id, type);

        break;
      default: '';
        break;
    }
  }

  checkDivision(organizationId: number, type: string) {
    let divisionValue: [] = this.form.value.division_ids;
    for (var i = 0; i < divisionValue?.length; i++) {
      let divOrganizationId = divisionValue[i][type];
      if (organizationId == divOrganizationId) {
        divisionValue.splice(i, 1);
        i--;
      }
    }
    this.form.controls['division_ids'].setValue(divisionValue);
    this._utilityService.detectChanges(this._cdr);
  }

  checkDepartment(divisionId: number, type: string) {
    let departmentValue: [] = this.form.value.department_ids;
    this.form.controls['department_ids'].setValue(departmentValue);
    this._utilityService.detectChanges(this._cdr);
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
