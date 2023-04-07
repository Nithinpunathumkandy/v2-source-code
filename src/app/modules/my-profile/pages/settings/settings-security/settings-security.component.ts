import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SecurityProfilesettingsService } from 'src/app/core/services/my-profile/settings/security-settings/security-profilesettings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ProfileSecuritySettingStore } from 'src/app/stores/my-profile/settings/security-settings';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-settings-security',
  templateUrl: './settings-security.component.html',
  styleUrls: ['./settings-security.component.scss']
})
export class SettingsSecurityComponent implements OnInit {

  changePassword = true;
  authentication = false;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  ProfileSecuritySettingStore = ProfileSecuritySettingStore;
  togglePassword: boolean = false;
  constructor(private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _helperService:HelperServiceService,
    private _securityService: SecurityProfilesettingsService,
    private _cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    AppStore.disableLoading();
    this.form = this._formBuilder.group({
      old_password: ['', [Validators.required]],
      new_password: ['', [Validators.required]],
      new_password_confirmation: ['', [Validators.required]]

    });

    this._securityService.getTwoFactorAuthenticationStatus().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  openChangePassword() {
    if (this.changePassword == true) {
      this.changePassword = false;
    }
    else {
      this.authentication = false;
      this.changePassword = true;
    }

  }

  cancel() {
    this.form.reset();
    this.form.markAsPristine();
    AppStore.disableLoading();
  }

  openAuthentication() {
    if (this.authentication == true)
      this.authentication = false;
    else {
      this.authentication = true;
      this.changePassword = false;
    }
  }

  save() {
    this.formErrors = null;
    AppStore.enableLoading();
    this._securityService.updateItem(this.form.value).subscribe((res: any) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);

      this.form.reset();

    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        AppStore.disableLoading();
      }
    });

  }

  toggleFieldTextType() {
    this.togglePassword = !this.togglePassword;
  }

  setVerification() {
    let status;
    if (ProfileSecuritySettingStore.verificationStatus == 'active')
      status = 'deactivate';
    else
      status = 'activate';
    this._securityService.updateStatus(status).subscribe(res => {
      if (status == 'activate')
      ProfileSecuritySettingStore.setVerificationStatusByEdit('active');
      else
      ProfileSecuritySettingStore.setVerificationStatusByEdit('deactive');
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }
}
