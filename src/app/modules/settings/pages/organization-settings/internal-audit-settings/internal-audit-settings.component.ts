import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditSettingsService } from 'src/app/core/services/settings/organization_settings/audit-settings/audit-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { AuditSettingStore } from 'src/app/stores/settings/audit-settings.store';

@Component({
  selector: 'app-internal-audit-settings',
  templateUrl: './internal-audit-settings.component.html',
  styleUrls: ['./internal-audit-settings.component.scss']
})
export class InternalAuditSettingsComponent implements OnInit {

  AuditSettingStore = AuditSettingStore;
  auditForm:FormGroup;
  formErrors:any;
  AppStore = AppStore;
  AuthStore = AuthStore;
  buttonDisabled : boolean = true;
  constructor(private _auditSettingsService:AuditSettingsService,
    private _formBuilder:FormBuilder,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _helperService:HelperServiceService) { }

  ngOnInit(): void {
   

    this.auditForm = this._formBuilder.group({
      id: [null],
      is_auditee_leader_approval:[null],
      is_process_auditable: [null],
      is_risk_auditable: [null],
      is_impact_analysis:[null],
      is_quick_correction:[null],
      who_add_audit_schedule: [''],
      who_add_corrective_action: [''],
      who_add_findings:[''],
      who_create_audit: [],
      who_create_audit_plan:[''],
      who_publish_audit_plan: [''],
      who_accept_resolved_finding:[''],
      who_accept_resolved_corrective_action:[''],
      is_audit_report_workflow:[null],
    })
    this.getAuditItems();

  }

  getAuditItems(){
    this._auditSettingsService.getItems().subscribe(()=> this.setFormValues())
  }

  setFormValues(){
    let auditSettingValue = AuditSettingStore?.auditSettingsItems;
    this.auditForm.setValue({
      id: auditSettingValue?.id,
      is_auditee_leader_approval:auditSettingValue?.is_auditee_leader_approval == 1 ? true : false,
      is_process_auditable: auditSettingValue?.is_process_auditable == 1 ? true : false,
      is_risk_auditable: auditSettingValue?.is_risk_auditable == 1 ? true : false,
      is_impact_analysis: auditSettingValue?.is_impact_analysis == 1 ? true : false,
      is_quick_correction: auditSettingValue?.is_quick_correction == 1 ? true : false,
      is_audit_report_workflow: auditSettingValue?.is_audit_report_workflow == 1 ? true : false,
      who_add_audit_schedule: auditSettingValue?.who_add_audit_schedule  ? auditSettingValue?.who_add_audit_schedule : 'audit-leader',
      who_add_corrective_action: auditSettingValue?.who_add_corrective_action ? auditSettingValue?.who_add_corrective_action : 'auditee',
      who_add_findings: auditSettingValue?.who_add_findings ? auditSettingValue?.who_add_findings : 'audit-leader',
      who_create_audit: auditSettingValue?.who_create_audit ? auditSettingValue?.who_create_audit : 'audit-leader',
      who_create_audit_plan: auditSettingValue?.who_create_audit_plan ? auditSettingValue?.who_create_audit_plan : 'auditors',
      who_publish_audit_plan: auditSettingValue?.who_publish_audit_plan ? auditSettingValue?.who_publish_audit_plan : 'audit-leader',
      who_accept_resolved_finding: auditSettingValue?.who_accept_resolved_finding ? auditSettingValue?.who_accept_resolved_finding : 'auditee',
      who_accept_resolved_corrective_action: auditSettingValue?.who_accept_resolved_corrective_action ? auditSettingValue?.who_accept_resolved_corrective_action : 'auditee-leader',
    })
  }

  changeSettings(controlName,event:boolean){
    this.buttonDisabled = false;
    this.auditForm.controls[controlName].setValue(event);
    this._utilityService.detectChanges(this._cdr);
  }

  submit(){
    this.formErrors = null;
    if (this.auditForm.value) {
      let save;
      AppStore.enableLoading();
      save = this._auditSettingsService.updateItem(this.auditForm.value);
      save.subscribe((res: any) => {
        this.buttonDisabled = true;
        //this.ngOnInit(); // calling to refresh page and disable save button after successfull api call
        this.getAuditItems();
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.buttonDisabled = true;
          this.formErrors = err.error.errors;
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        }
      });
    }
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  enableSaveButton(){
    this.buttonDisabled = false;
  }
}
