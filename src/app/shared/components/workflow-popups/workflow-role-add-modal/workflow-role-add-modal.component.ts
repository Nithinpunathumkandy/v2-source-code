import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AmWorkflowService } from 'src/app/core/services/audit-management/am-workflow/am-workflow.service';
import { BcpWorkflowService } from 'src/app/core/services/bcm/bcp-workflow/bcp-workflow.service';
import { ComplianceWorkflowService } from 'src/app/core/services/compliance-management/compliance-workflow/compliance-workflow.service';
import { CyberIncidentWorkflowService } from 'src/app/core/services/cyber-incident/cyber-incident-workflow/cyber-incident-workflow.service';
import { EventWorkflowService } from 'src/app/core/services/event-monitoring/event-workflow/event-workflow.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditWorkflowService } from 'src/app/core/services/internal-audit/audit-workflow/audit-workflow.service';
import { IsmsRiskWorkflowService } from 'src/app/core/services/isms/isms-risk-workflow/isms-risk-workflow.service';
import { WorkflowService } from 'src/app/core/services/knowledge-hub/work-flow/workflow.service';
import { KpiWorkflowService } from 'src/app/core/services/kpi-management/kpi-workflow/kpi-workflow.service';
import { MockDrillWorkflowService } from 'src/app/core/services/mock-drill/mock-drill-workflow/mock-drill-workflow.service';
import { MrmWorkflowService } from 'src/app/core/services/mrm/mrm-workflow/mrm-workflow.service';
import { MsAuditWorkflowService } from 'src/app/core/services/ms-audit-management/audit-workflow/audit-workflow.service';
import { ProjectWorkflowServiceService } from 'src/app/core/services/project-monitoring/project-monitoring-workflow/project-workflow-service.service';
import { RiskWorkflowService } from 'src/app/core/services/risk-management/risk-workflow/risk-workflow.service';
import { StrategyWorkflowService } from 'src/app/core/services/strategy-management/strategy-workflow/strategy-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuditWorkflowStore } from 'src/app/stores/internal-audit/audit-workflow/audit-workflow-store';

@Component({
  selector: 'app-workflow-role-add-modal',
  templateUrl: './workflow-role-add-modal.component.html',
  styleUrls: ['./workflow-role-add-modal.component.scss']
})
export class WorkflowRoleAddModalComponent implements OnInit {

  @Input('source') WorkFlowSource: any;

  commonForm: FormGroup;
  AuditWorkflowStore = AuditWorkflowStore;
  AppStore = AppStore;
  formErrors: any;
  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _auditWorkflowService: AuditWorkflowService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
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
    this.commonForm = this._formBuilder.group({
      user_ids: [''],
      user_type_id: ['', [Validators.required]]
    })
    this.resetForm();
    this.getuserTypes();
    console.log(this.WorkFlowSource.values.module);

  }

  save(close: boolean = false) {
    let save;
    if (this.commonForm.value) {
      AppStore.enableLoading();
      let saveData = {
        "user_type_id": this.commonForm.value.user_type_id ? this.commonForm.value.user_type_id : '',
        "level": this.WorkFlowSource.values ? this.WorkFlowSource.values.level : ''
      }
      console.log(this.WorkFlowSource.values.module);

      // save = this._auditWorkflowService.saveRoleAdd(saveData,this.WorkFlowSource.values?this.WorkFlowSource.values.workflowId:'');
      switch (this.WorkFlowSource.values.module) {
        case 'IA':
          save = this._auditWorkflowService.saveRoleAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;

        case 'KH':
          save = this._khWorkflowService.saveRoleAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;

        case 'RM':
          save = this._riskWorkflowService.saveRoleAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;

        case 'MRM':
          save = this._mrmWorkflowService.saveRoleAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;
        case 'KPI':
          save = this._kpiWorkflowService.saveRoleAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;

        case 'CM':
          save = this._complianceWorkflowService.saveRoleAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;

        case 'BCM':
          save = this._bcpWorkflowService.saveRoleAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;

        case 'Strategy_Module':
          save = this._strategyWorkflowService.saveRoleAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;
        case 'ISMS':
          save = this._ismsRiskWorkflowService.saveRoleAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;

        case 'Project_Monitoring_Module':
          save = this._projectWorkflowService.saveRoleAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;

        case 'CI':
            save = this._cyberIncidentWorkflowService.saveRoleAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;

        case 'AM':
          save = this._amWorkflowService.saveRoleAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;

        case 'EM':
          save = this._eventWorkflowService.saveRoleAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;

        case 'Ms_Audit':
          save = this._msAuditWorkflowService.saveRoleAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;
        case 'MOCK_DRILL':
          save = this._mockDrillWorkflowService.saveRoleAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;
        default:
          break;
      }
    }
    save.subscribe((res: any) => {
      if (!this.commonForm.value.id) {
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

  cancel() {
    this.close();
  }

  close() {
    this.resetForm();
    this._eventEmitterService.dismissWorkflowRoleAddModal()
    this._eventEmitterService.setModalStyle()
  }

  resetForm() {
    this.commonForm.reset();
    this.commonForm.pristine;
    this.formErrors = null;
  }

  getuserTypes() {
    this._auditWorkflowService.getUserTypes('?module_group_ids=' + this.WorkFlowSource?.values?.moduleGroupId).subscribe(res => {
    })
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }


}
