import { Component, OnInit, ChangeDetectorRef, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthStore } from "src/app/stores/auth.store";
import { AppStore } from "src/app/stores/app.store";
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ThemeLoginSettingStore } from 'src/app/stores/settings/theme/theme-login.store';
import { ThemeLoginSettingsService } from 'src/app/core/services/settings/theme-settings/theme-login-settings/theme-login-settings.service';
@Component({
  selector: 'app-two-factor-authentication',
  templateUrl: './two-factor-authentication.component.html',
  styleUrls: ['./two-factor-authentication.component.scss']
})
export class TwoFactorAuthenticationComponent implements OnInit {
  @ViewChildren('ngOtpInput') ngOtpInput: any;

  AuthStore = AuthStore;
  ThemeLoginSettingStore = ThemeLoginSettingStore;
  AppStore = AppStore;
  form: FormGroup;
  submitted: boolean = false;
  enableResend = true;
  resendCount = 0; 
  formError = null;
  config = {
    allowNumbersOnly: true,
    length: 4,
    timer: 1,
    placeholder: "-",
    inputClass:'text-center form-control rounded'
  };
  constructor(private _authService: AuthService,private _formBuilder: FormBuilder,
    private _utilityService: UtilityService, private _cdr: ChangeDetectorRef,
    private _router: Router,private _themeloginservice:ThemeLoginSettingsService) { 
    }

  ngOnInit(): void {
    
    if (ThemeLoginSettingStore?.loginbgImageDetails?.preview_url != null) 
    this.setBackgroundImage();
    this.getLoginTheme();
    document.body.classList.add('forget-body');
    AppStore.disableLoading();
    this.form = this._formBuilder.group({
      otp: ['', [Validators.required,Validators.minLength(4)]],
      otp_token: [null]
    });
    if(AuthStore.twoFactorAuthenticationDetails)
      this.form.patchValue({otp_token: AuthStore.twoFactorAuthenticationDetails.otp_token});
  }

  submitOtp(){
    if(this.form.valid){
      this.formError = null;
      this.submitted = true;
      this.enableResend = false;
      this._utilityService.detectChanges(this._cdr);
      this._authService.verifyOtp(this.form.value).subscribe(res=>{
        if (AuthStore.redirectUrl) {
          const url = AuthStore.redirectUrl;
          AuthStore.setRedirectUrl(null);
          this._router.navigateByUrl(url);
      } else this._router.navigateByUrl('/dashboard');
      
      this.resendInterval();
      AuthStore.setTwoFactorAuthenticationDetails(null);
      }, (err: HttpErrorResponse) => {
        if (err.status == 401 || err.status == 422) {
            // this._utilityService.toast('Otp Verification Failed', 'w', 'tl');
            this.formError = err.error.error ? err.error.error : 'Otp Verification Failed';
        }
        this.enableResend = true;
        this.submitted = false;
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  resendOtp(){
    if(AuthStore.twoFactorAuthenticationDetails.otp_token){
      this.resendCount ++;
      AppStore.enableLoading();
      this._utilityService.detectChanges(this._cdr);
      var otpData = { otp_token: AuthStore.twoFactorAuthenticationDetails.otp_token};
      this._authService.resendOtp(otpData).subscribe(res=>{
        this.enableResend = false;
        AppStore.disableLoading();
        this._utilityService.toast('Otp Resend','w', 'tl');
        this._utilityService.detectChanges(this._cdr);
        this.resendInterval();
      },(err: HttpErrorResponse) =>{
        this.enableResend = true;
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      })
    }
  }


  resendInterval(){
    setTimeout(() => {
      this.enableResend = true;
      this._utilityService.detectChanges(this._cdr);
    }, 20000);
  }

  otpChange(event){
      this.form.patchValue({otp: event})
    if(this.form.valid)
      this.submitOtp();
  }

  ngOnDestroy(){
    document.body.classList.remove('forget-body');
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
  let authBgUrl = ThemeLoginSettingStore.authbgImageDetails.preview_url;
  let url = "url(" + authBgUrl + ")";
  document.body.style.backgroundImage =url;
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
