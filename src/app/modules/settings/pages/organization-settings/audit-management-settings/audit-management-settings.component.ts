import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditManagementSettingsService } from 'src/app/core/services/settings/organization_settings/audit-management-settings/audit-management-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { AuditManagementSettingStore } from 'src/app/stores/settings/audit-management-store';

@Component({
  selector: 'app-audit-management-settings',
  templateUrl: './audit-management-settings.component.html',
  styleUrls: ['./audit-management-settings.component.scss']
})
export class AuditManagementSettingsComponent implements OnInit, OnDestroy {

  form:FormGroup;
  formErrors:any;

  AppStore = AppStore;
  AuthStore = AuthStore;
  AuditManagementSettingStore = AuditManagementSettingStore ;

  buttonDisabled : boolean = true;
  
  constructor(
    private _cdr:ChangeDetectorRef,
    private _formBuilder:FormBuilder,
    private _utilityService:UtilityService,
    private _helperService:HelperServiceService,
    private _auditMangementSettingsService:AuditManagementSettingsService,
  ) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      id: [null],
      commencement_letter_subject: ['', [Validators.required]],
      commencement_letter_body: ['', [Validators.required]],
    });

    this.getItems();
  }

  getItems(){
    this._auditMangementSettingsService.getItems().subscribe(()=> this.setFormValues())
  }

  setFormValues(){
    this.form.setValue({
      id: AuditManagementSettingStore.auditMangementSettingsItems?.id ? AuditManagementSettingStore.auditMangementSettingsItems?.id: null,
      commencement_letter_subject: AuditManagementSettingStore.auditMangementSettingsItems?.commencement_letter_subject ? AuditManagementSettingStore.auditMangementSettingsItems?.commencement_letter_subject: '',
      commencement_letter_body: AuditManagementSettingStore.auditMangementSettingsItems?.commencement_letter_body ?  AuditManagementSettingStore.auditMangementSettingsItems?.commencement_letter_body: '',
    });
    this._utilityService.detectChanges(this._cdr);
  }

  
  submit(){
    
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      save = this._auditMangementSettingsService.updateItem(this.form.value);
      save.subscribe((res: any) => {
        this.getItems();
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
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

  ngOnDestroy(): void {
    AuditManagementSettingStore.unsetAuditManagemntSettings();
  }
}
