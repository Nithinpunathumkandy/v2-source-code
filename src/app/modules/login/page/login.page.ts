import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { JwtToken, TwoWayAuthentication } from 'src/app/core/models/jwt-token.model';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Router } from '@angular/router';
import { AuthStore } from 'src/app/stores/auth.store';
import { ThemeLoginSettingsService } from 'src/app/core/services/settings/theme-settings/theme-login-settings/theme-login-settings.service';
import { ThemeLoginSettingStore } from 'src/app/stores/settings/theme/theme-login.store';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-login-page',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit, OnDestroy {

    @ViewChild('emailInput') emailInput: ElementRef;
    form: FormGroup;
    submitted: boolean = false;
    togglePassword: boolean = false;
    rememberMe: boolean = false;
    AuthStore = AuthStore;
    ThemeLoginSettingStore = ThemeLoginSettingStore;
    loginbgurl: any;
    loader:boolean = true;
    constructor(
        private _formBuilder: FormBuilder,
        private _authService: AuthService,
        private _utilityService: UtilityService,
        private _cdr: ChangeDetectorRef,
        private _router: Router,
        private _themeloginservice: ThemeLoginSettingsService) {
        if(ThemeLoginSettingStore?.loginbgImageDetails?.preview_url == null){
            this.loader = true;
        }
        const htmlTag = document.getElementsByTagName("html")[0] as HTMLHtmlElement;
        htmlTag.dir = "ltr"; 
    }

    ngOnInit() {
        if (ThemeLoginSettingStore?.loginbgImageDetails?.preview_url != null) {
            this.setBackgroundImage();
        }
        else{
            this.loader = true;
            this.getLoginTheme();
        }
        document.body.classList.add('login-body');

        this.form = this._formBuilder.group({
            email: ['', [Validators.required]],
            password: ['', [Validators.required]],
        });

        if (window.localStorage.getItem('login_details')) {
            var loginDetails: any = JSON.parse(window.localStorage.getItem('login_details'));
            this.rememberMe = true;
            this.form.setValue({
                email: loginDetails['username'],
                password: loginDetails['password']
            })
        }

        setTimeout(() => {
            this.emailInput.nativeElement.focus();
        }, 250);
    }

    login() {
        if (this.form.value) {
            this.checkForRememberMe()
            this.submitted = true;
            this._utilityService.detectChanges(this._cdr);
            this._authService.attemptAuth(this.form.value.email, this.form.value.password).subscribe((res: any) => {
                if(res.is_password_validity_expired){
                    AuthStore.setUserId(res.user_id);
                    this._router.navigateByUrl('/change-password');
                }
                else if (res.is_two_factor_auth_enabled) {
                    // Redirect to authentication page
                    AuthStore.setTwoFactorAuthenticationDetails(res);
                    this._router.navigateByUrl('/two-factor-authentication');

                }
                else {
                    if (AuthStore.redirectUrl) {
                        const url = AuthStore.redirectUrl;
                        AuthStore.setRedirectUrl(null);
                        this._router.navigateByUrl(url);
                    } else this._router.navigateByUrl('/organization/business-profile');

                }
                this._utilityService.detectChanges(this._cdr);

            }, (err: HttpErrorResponse) => {
                if (err.status == 401 || err.status == 422) {
                    if(err.error?.message){
                        let errMessage = err.error?.message;
                        if(errMessage == 'Unauthorized'){
                            this._utilityService.toast('Invalid Credentials', 'w', 'br');
                        }
                        else{
                            this._utilityService.toast(errMessage, 'w', 'br');
                        }
                    }
                    else{
                        this._utilityService.toast('Invalid Credentials', 'w', 'br');
                    }
                }

                this.submitted = false;
                this._utilityService.detectChanges(this._cdr);
            });

        }
    }

    loginWithGoogle() {
        window.open('https://v2-dev-api.isorobot.io/integrations/google-sso/redirect', '_self');
        //this._authService.redirectToGoogleLogin();
    }

    loginWithLinkedIn() {
        window.open('https://v2-dev-api.isorobot.io/integrations/linkedin-sso/redirect', '_self');
    }

    ngOnDestroy() {
        document.body.classList.remove('login-body');
        document.body.style.backgroundImage = null;
    }

    toggleFieldTextType() {
        this.togglePassword = !this.togglePassword;
    }

    checkForRememberMe() {
        if (this.rememberMe) {
            var loginCredentials = { username: this.form.value.email, password: this.form.value.password };
            window.localStorage.setItem('login_details', JSON.stringify(loginCredentials));
        }
        else {
            window.localStorage.removeItem('login_details');
        }
    }

    changeRememberMe() {
        this.rememberMe = !this.rememberMe;
    }

    getLoginTheme() {
        this._themeloginservice.getLoginTheme().subscribe(() => this.setImage(),
        (error)=>{
            this.loader = false;
        });
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
        setTimeout(() => {
            this.loader = false;
            this._utilityService.detectChanges(this._cdr);
        }, 250);
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
}
