import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthStore } from 'src/app/stores/auth.store';
import { ThemeLoginSettingStore } from 'src/app/stores/settings/theme/theme-login.store';
import { ThemeLoginSettingsService } from 'src/app/core/services/settings/theme-settings/theme-login-settings/theme-login-settings.service';

declare var $: any;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  AppStore = AppStore;
  emailId = null;
  formErrors: any;
  AuthStore =AuthStore;
  ThemeLoginSettingStore = ThemeLoginSettingStore;
  loginbgurl:any;
  constructor(
    private _authService: AuthService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _themeloginservice:ThemeLoginSettingsService) { }

  ngOnInit(): void {
    if (ThemeLoginSettingStore?.loginbgImageDetails?.preview_url != null) 
            this.setBackgroundImage();
        this.getLoginTheme();
    let loginbgurl = ThemeLoginSettingStore.loginbgImageDetails.preview_url;
        let url = "url(" + loginbgurl + ")";
        document.body.style.backgroundImage =url;
    AppStore.disableLoading();
    document.body.classList.add('login-body');
  }

  submit() {
    this.formErrors = null;
    AppStore.enableLoading();
    let email = {
      email: this.emailId
    }
    this._authService.forgotPassword(email).subscribe(res => {
      AppStore.disableLoading();
      $(this.mailConfirmationPopup.nativeElement).modal('show');
      this.emailId = null;
      // this._utilityService.showSuccessMessage('',res.message);
      this._utilityService.detectChanges(this._cdr)
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        AppStore.disableLoading();
      }
    })
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
