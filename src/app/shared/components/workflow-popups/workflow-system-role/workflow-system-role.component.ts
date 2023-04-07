import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AclService } from "src/app/core/services/acl/acl.service";
import { AclStore } from "src/app/stores/acl/acl.store";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse } from '@angular/common/http';
import { RiskWorkflowService } from "src/app/core/services/risk-management/risk-workflow/risk-workflow.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { ComplianceWorkflowService } from 'src/app/core/services/compliance-management/compliance-workflow/compliance-workflow.service';
import { IsmsRiskWorkflowService } from 'src/app/core/services/isms/isms-risk-workflow/isms-risk-workflow.service';
import { AmWorkflowService } from 'src/app/core/services/audit-management/am-workflow/am-workflow.service';
import { WorkflowService } from 'src/app/core/services/knowledge-hub/work-flow/workflow.service';

@Component({
  selector: 'app-workflow-system-role',
  templateUrl: './workflow-system-role.component.html',
  styleUrls: ['./workflow-system-role.component.scss']
})
export class WorkflowSystemRoleComponent implements OnInit {
  @Input('source') WorkFlowSource: any;
  AclStore = AclStore;
  AppStore = AppStore;
  commonForm: FormGroup;
  formErrors = null;
  constructor(private _aclService: AclService, private _cdr: ChangeDetectorRef, private _utilityService: UtilityService,
    private _formBuilder: FormBuilder,
     private _riskWorkflowService: RiskWorkflowService,
     private _amWorkflowService:AmWorkflowService,
    private _eventEmitterService: EventEmitterService,
    private _complianceWorkflowService: ComplianceWorkflowService,
    private _ismsRiskWorkflowService: IsmsRiskWorkflowService,
    private _khWorkflowService: WorkflowService,
  ) { }

  ngOnInit(): void {
    this.getRoles();
    this.commonForm = this._formBuilder.group({
      role_id: [null, [Validators.required]]
    })
  }

  getRoles() {
    this._aclService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchRoles(e) {
    this._aclService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  save(close: boolean = false) {

    let saveData = {
      "level": this.WorkFlowSource.values ? this.WorkFlowSource.values.level : '',
      "role_id": this.commonForm.value.role_id
    };
    this.formErrors = null;

    if (this.commonForm.value) {
      let save;
      AppStore.enableLoading();
      // if (this.commonForm.value.id) {
      // } else {
      // delete this.commonForm.value.id
      switch (this.WorkFlowSource.values.module) {
        case 'RM':
          save = this._riskWorkflowService.saveSystemRole(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;
        case 'ISMS':
          save = this._ismsRiskWorkflowService.saveSystemRole(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;
          case 'AM':
            save = this._amWorkflowService.saveSystemRole(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;
           case 'KH':
              save = this._khWorkflowService.saveSystemRole(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
              break;
        default:
          break;
        // }
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
  }

  cancel() {
    this.close();
  }

  close() {
    this.resetForm();
    this._eventEmitterService.dismissWorkflowSystemRoleModal()
    this._eventEmitterService.setModalStyle()
  }

  closeFormModal() {
    this.close();
  }

  resetForm() {
    this.commonForm.reset();
    this.commonForm.pristine;
    this.formErrors = null;
  }

}
