import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { JwtToken } from 'src/app/core/models/jwt-token.model';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Router } from '@angular/router';
import { IdleTimeoutStore } from "src/app/stores/idle-timeout.store";
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";

import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { ThemeLoginSettingStore } from "src/app/stores/settings/theme/theme-login.store";
import { UserAclService } from 'src/app/core/services/human-capital/user/user-setting/user-acl/user-acl.service';
import { OrganizationModulesService } from 'src/app/core/services/settings/organization-modules/organization-modules.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-idle-timeout',
  templateUrl: './idle-timeout.component.html',
  styleUrls: ['./idle-timeout.component.scss']
})
export class IdleTimeoutComponent implements OnInit {

  IdleTimeoutStore = IdleTimeoutStore;
  form: FormGroup;
  submitted: boolean = false;
  AppStore = AppStore;
  togglePassword: boolean = false;
  ThemeLoginSettingStore = ThemeLoginSettingStore;
  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _userAclService: UserAclService,
    private _organizationModuleService: OrganizationModulesService) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  
  login() {
    this.form.patchValue({
      email: IdleTimeoutStore.getUser?.email
    });
    if (this.form.value.email && this.form.value) {
        this.submitted = true;
        this._utilityService.detectChanges(this._cdr);
        this._authService.attemptAuth(this.form.value.email, this.form.value.password,'system_lock').subscribe((res: JwtToken) => {
            this._authService.populate().subscribe();
            this._userAclService.getUserActivityPermissions().subscribe();
            this._organizationModuleService.getAllItems('?side_menu=true').subscribe();
            if (AuthStore.redirectUrl) {
                const url = AuthStore.redirectUrl;
                AuthStore.setRedirectUrl(null);
                this._router.navigateByUrl(url);
            } else this._router.navigateByUrl('/dashboard');
            this.resetModalData();
            this._eventEmitterService.showHideIdleModal(false);
        }, (err: HttpErrorResponse) => {
            this.resetModalData();
            //this._eventEmitterService.showHideIdleModal(false);
            if (err.status == 401 || err.status == 422) {
                // this._utilityService.toast('Invalid Credentials', 'w', 'tl');
              if(err.error?.message){
                let errMessage = err.error?.message;
                if(errMessage == 'Unauthorized'){
                    this._utilityService.toast('Invalid Credentials', 'w', 'tl');
                }
                else{
                    this._utilityService.toast(errMessage, 'w', 'tl');
                }
              }
              else{
                  this._utilityService.toast('Invalid Credentials', 'w', 'tl');
              }
            }
            else{
              this._eventEmitterService.showHideIdleModal(false);
            }
            this._utilityService.detectChanges(this._cdr);
        });
    }
    else{
      this.resetModalData();
      this._eventEmitterService.showHideIdleModal(false);
      this._router.navigateByUrl('/login');
    }
  }

  resetModalData(){
    this.submitted = false;
    this.form.reset();
  }

  toggleFieldTextType() {
    this.togglePassword = !this.togglePassword;
  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  getDefaultImage(){
    return this._imageService.getDefaultImageUrl('user-logo');
  }

  loginWithGoogle(){
    window.open('https://v2-dev-api.isorobot.io/integrations/google-sso/redirect','_self');
    //this._authService.redirectToGoogleLogin();
  }

  loginWithLinkedIn(){
      window.open('https://v2-dev-api.isorobot.io/integrations/linkedin-sso/redirect','_self');
  }

  logout() {
    this._eventEmitterService.showHideIdleModal(false);
    setTimeout(() => {
      this._authService.purgeAuth();
      this._router.navigateByUrl('/login');
    }, 100);
  }

}
