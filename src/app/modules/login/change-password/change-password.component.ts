import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangePasswordService } from 'src/app/core/services/change-password/change-password.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UserSecurityService } from 'src/app/core/services/human-capital/user/user-setting/user-security/user-security.service';
import { ThemeLoginSettingsService } from 'src/app/core/services/settings/theme-settings/theme-login-settings/theme-login-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ThemeLoginSettingStore } from 'src/app/stores/settings/theme/theme-login.store';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  ThemeLoginSettingStore = ThemeLoginSettingStore;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  toggleNewPassword: boolean = false;
  toggleOldPassword: boolean = false;
  toggleConfirmPassword: boolean = false;
  
  constructor(private _themeloginservice: ThemeLoginSettingsService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _changepasswordService:ChangePasswordService,
    private _helperService:HelperServiceService,
    private _formBuilder:FormBuilder, private _router: Router,
    private _authService: AuthService) { }

  ngOnInit(): void { 
    document.body.classList.add('forget-body');
    if (ThemeLoginSettingStore?.loginbgImageDetails?.preview_url != null)
      this.setBackgroundImage();
      else
    this.getLoginTheme();

    this.form = this._formBuilder.group({
      user_id:[null,[Validators.required]],
      old_password: ['', [Validators.required]],
      new_password: ['', [Validators.required]],
      new_password_confirmation: ['', [Validators.required]]
    });
    let userId = null;
    if(AuthStore.user)
      userId = AuthStore.user.id;
    else
      userId = AuthStore.userId;
    this.form.patchValue({
      user_id: userId
    });
  }

  getLoginTheme() {
    this._themeloginservice.getLoginTheme().subscribe(() => this.setImage());
  }
  setImage() {
    let imageDetails = ThemeLoginSettingStore.themeLoginDetailsById?.app_login_setting_images;
    if (imageDetails?.length > 0) {
      for (let i = 0; i < imageDetails?.length; i++) {
        let category = imageDetails[i].type;
        var preview = this._themeloginservice.getThumbnailPreview(category, imageDetails[i].token);
        imageDetails[i]['preview_url'] = preview;
        this.ThemeLoginSettingStore.setImageDetails(imageDetails[i], category);
        this._utilityService.detectChanges(this._cdr);
      }
    }
    this.setBackgroundImage();
  }

  setBackgroundImage() {
    let loginbgurl = ThemeLoginSettingStore.loginbgImageDetails?.preview_url;
    let url = "url(" + loginbgurl + ")";
    document.body.style.backgroundImage = url;
  }

  errorHandler(event, type) {
    switch (type) {
      case 'topcube':
        event.target.src = "assets/images/log-large-square.png";
        break;
      case 'bottomcube':
        event.target.src = "assets/images/log-small-square.png";
        break
      case 'clientlogo':
        event.target.src = "assets/images/login-logo.png";
        break
    }
  }

  save() {
    this.formErrors = null;
    let userId = null;
    if(AuthStore.user)
      userId = AuthStore.user.id;
    else
      userId = AuthStore.userId;
    this.form.setValue({
      user_id: userId,
      old_password: this.form.value.old_password,
      new_password: this.form.value.new_password,
      new_password_confirmation:this.form.value.new_password_confirmation
    })
    AppStore.enableLoading();
    this._changepasswordService.changePassword(this.form.value)
    .subscribe((res: any) => {
      AppStore.disableLoading();
      this.form.reset();
      if(AuthStore.user){
        this._authService.purgeAuth();
      }
      this._router.navigateByUrl('/login');
      this._utilityService.detectChanges(this._cdr);
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      if (err.status == 422) {
        this.formErrors = err.error.errors;    
      }
      this._utilityService.detectChanges(this._cdr);
    });

  }

  toggleFieldTextType(){
    this.toggleNewPassword = !this.toggleNewPassword;
  }

  toggleOldPasswordField(){
    this.toggleOldPassword = !this.toggleOldPassword;
  }

  toggleConfirmPasswordField(){
    this.toggleConfirmPassword = !this.toggleConfirmPassword;
  }

  checkFormValid(){
    if((this.form.value.new_password == this.form.value.new_password_confirmation) && this.form.valid)
      return true;
    else
      return false;
  }

  comparePasswords(){
    if(this.form.value.new_password && this.form.value.new_password_confirmation && (this.form.value.new_password == this.form.value.new_password_confirmation))
      return true;
    else if(this.form.value.new_password && this.form.value.new_password_confirmation && (this.form.value.new_password != this.form.value.new_password_confirmation))
      return false;
    else return true;
  }

  ngOnDestroy(){
    document.body.classList.remove('forget-body');
    document.body.style.backgroundImage = null;
  }
}
