import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse } from '@angular/common/http';
import { ThemeLoginSettingStore } from 'src/app/stores/settings/theme/theme-login.store';
import { ThemeLoginSettingsService } from 'src/app/core/services/settings/theme-settings/theme-login-settings/theme-login-settings.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  AppStore = AppStore;
  formErrors: any;
  togglePassword: boolean = false;
  toggleConfirmPassword: boolean = false;
  loginbgurl:any;
  ThemeLoginSettingStore= ThemeLoginSettingStore;
  buttonDisabled:boolean = true;
  newPassword:any;
  confirmPassword:any;
  code:any;

  constructor(private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private _themeloginservice:ThemeLoginSettingsService,
    private _route: Router) {
      this.route.paramMap.subscribe(params => {
        this.code = params
      })
     }

  ngOnInit(): void {
    if (ThemeLoginSettingStore?.loginbgImageDetails?.preview_url != null) 
    this.setBackgroundImage();
    this.getLoginTheme();

    document.body.classList.add('login-body');
    this.form = this._formBuilder.group({
      code: ['', [Validators.required]],
      password: ['', [Validators.required]],
      password_confirm: ['', [Validators.required]]
    });

    this.setFormValue();
  }

  setFormValue(){
    var startPosition = this._route.url.indexOf('?');
    let token = this._route.url.substring(startPosition + 1, this._route.url.length);
    this.form.setValue({
      code:token,
      password:'',
      password_confirm:''
    })
  }

  toggleFieldTextType(type) {
    if (type == 'psd')
      this.togglePassword = !this.togglePassword;
    else
      this.toggleConfirmPassword = !this.toggleConfirmPassword;
  }

  checkFormValid(){
    if((this.form.value.password == this.form.value.password_confirm) && this.form.valid)
      return false;
    else
      return true;
  }

  comparePasswords(){
    if(this.form.value.password && this.form.value.password_confirm && (this.form.value.password == this.form.value.password_confirm))
      return true;
    else if(this.form.value.password && this.form.value.password_confirm && (this.form.value.password != this.form.value.password_confirm))
      return false;
    else 
    return true;
  }

  reset() {
    if (this.form.value.password == this.form.value.password_confirm) {
      this.formErrors = null;
      // let token;
      AppStore.enableLoading();
      // var startPosition = this._route.url.indexOf('?');
      // token = this._route.url.substring(startPosition + 1, this._route.url.length);
      // this.form.value.code = token;
      this._authService.resetPassword(this.form.value).subscribe(res => {
        AppStore.disableLoading();
        this.form.reset();
        this._utilityService.detectChanges(this._cdr);
        this._route.navigateByUrl('');
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
          AppStore.disableLoading();
        }
        else
          this._utilityService.showErrorMessage('', err.error.message)

      });
    }
  }

  ngOnDestroy() {
    document.body.classList.remove('login-body');
    document.body.style.backgroundImage ="";
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

setBackgroundImage(){
    this.loginbgurl = ThemeLoginSettingStore.loginbgImageDetails?.preview_url;
    let url = "url(" + this.loginbgurl + ")";
    document.body.style.backgroundImage = url;
}

  errorHandler(event, type) {
    // console.debug(event);
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
}
