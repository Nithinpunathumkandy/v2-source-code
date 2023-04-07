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
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { AuditWorkflowService } from 'src/app/core/services/internal-audit/audit-workflow/audit-workflow.service';
import { IsmsRiskWorkflowService } from 'src/app/core/services/isms/isms-risk-workflow/isms-risk-workflow.service';
import { KhFileServiceService } from 'src/app/core/services/knowledge-hub/templates/kh-file-service.service';
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
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';

@Component({
  selector: 'app-workflow-team-add-modal',
  templateUrl: './workflow-team-add-modal.component.html',
  styleUrls: ['./workflow-team-add-modal.component.scss']
})
export class WorkflowTeamAddModalComponent implements OnInit {

  @Input('source') WorkFlowSource: any;
  commonForm: FormGroup;
  AppStore = AppStore;
  UsersStore = UsersStore;
  formErrors: any;
  users: any = [];
  constructor(
    private _userService: UsersService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _khFileService: KhFileServiceService,
    private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _auditWorkflowService: AuditWorkflowService,
    private _khWorkflowService: WorkflowService,
    private _riskWorkflowService: RiskWorkflowService,
    private _mrmWorkflowService: MrmWorkflowService,
    private _complianceWorkflowService: ComplianceWorkflowService,
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
      user_ids: ['', [Validators.required]]
    })
    this.resetForm();
    this.getUsers();
  }

  save(close: boolean = false) {
    let save;
    let saveData = {
      "user_ids": [],
      "level": this.WorkFlowSource.values ? this.WorkFlowSource.values.level : '',
    }

    if (this.commonForm.value) {
      AppStore.enableLoading();

      if (this.commonForm.value.user_ids) {
        this.commonForm.value.user_ids.forEach(element => {
          saveData.user_ids.push(element.id);
        });
      }
      // save = this._auditWorkflowService.saveUserTeamAdd(saveData,this.WorkFlowSource.values?this.WorkFlowSource.values.workflowId:'');
      switch (this.WorkFlowSource.values.module) {
        case 'IA':
          save = this._auditWorkflowService.saveUserTeamAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;

        case 'KH':
          save = this._khWorkflowService.saveUserTeamAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;

        case 'RM':
          save = this._riskWorkflowService.saveUserTeamAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;

        case 'MRM':
          save = this._mrmWorkflowService.saveUserTeamAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;

        case 'KPI':
          save = this._kpiWorkflowService.saveUserTeamAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;

        case 'CM':
          save = this._complianceWorkflowService.saveUserTeamAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;

        case 'BCM':
          save = this._bcpWorkflowService.saveUserTeamAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;

        case 'Strategy_Module':
          save = this._strategyWorkflowService.saveUserTeamAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;

        case 'ISMS':
          save = this._ismsRiskWorkflowService.saveUserTeamAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;

        case 'Project_Monitoring_Module':
          save = this._projectWorkflowService.saveUserTeamAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;

        case 'CI':
            save = this._cyberIncidentWorkflowService.saveUserTeamAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
            break;

        case 'AM':
          save = this._amWorkflowService.saveUserTeamAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;

        case 'EM':
          save = this._eventWorkflowService.saveUserTeamAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;
        case 'Ms_Audit':
          save = this._msAuditWorkflowService.saveUserTeamAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
          break;
        case 'MOCK_DRILL':
          save = this._mockDrillWorkflowService.saveUserTeamAdd(saveData, this.WorkFlowSource.values ? this.WorkFlowSource.values.workflowId : '');
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

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      item['searchLabel'] = item['first_name'] + '' + item['last_name'] + '' + item['email'] + '' + item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  getUsers() {
    this._userService
      .getAllItems()
      .subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
  }

  cancel() {
    this.close();
  }

  searchUers(e) {
    this._userService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  createImageUrl(token, type) {
    return this._khFileService.getThumbnailPreview(type, token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  close() {
    this.resetForm();
    this._eventEmitterService.dismissWorkflowTeamAddModal()
    this._eventEmitterService.setModalStyle()
  }

  resetForm() {
    this.commonForm.reset();
    this.commonForm.pristine;
    this.formErrors = null;
    this.users = [];
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

}
