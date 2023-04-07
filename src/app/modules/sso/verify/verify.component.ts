import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { SsoAuth } from 'src/app/core/models/jwt-token.model';
import { UtilityService } from "src/app/shared/services/utility.service";
import { AuthStore } from 'src/app/stores/auth.store';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  queryParams = {
    authuser: '',
    code: '',
    prompt: '',
    scope: '',
    type: '',
  }
  queryString = '';
  constructor(private _routeSnapshot: ActivatedRoute, private _authService: AuthService, private _route: Router,
    private _utilityService: UtilityService, private _cdr: ChangeDetectorRef ) { }

  ngOnInit(): void {
    var startPosition = this._route.url.indexOf('&');
    this.queryString = this._route.url.substring(startPosition+1,this._route.url.length);
    //setTimeout(() => {
      this.queryParams.type = this._routeSnapshot.snapshot.queryParams['type'];
      this.queryParams.code = this._routeSnapshot.snapshot.queryParams['code'];
      this._utilityService.detectChanges(this._cdr);
      this.verifySocialLogin();
    //}, 1000);
  }

  verifySocialLogin(){
    if(this.queryParams.type == 'google'){
      this.verifyGoogleLogin();
    }
    else{
      this.verifyLinkedInLogin();
    }
  }

  verifyGoogleLogin(){
    this._authService.verifyGoogleLogin(this.queryString)
    .subscribe((res:SsoAuth)=>{
      if(res.error){
        this._utilityService.showErrorMessage('Google Login',res.message);
        this._route.navigateByUrl('');
      }
      else{
        if(res.is_two_factor_auth_enabled){
          AuthStore.setTwoFactorAuthenticationDetails(res);
          this._route.navigateByUrl('/two-factor-authentication')
        }
        else{
          this._authService.setToken(res);
          if (AuthStore.redirectUrl) {
            const url = AuthStore.redirectUrl;
            AuthStore.setRedirectUrl(null);
            this._route.navigateByUrl(url);
        } else this._route.navigateByUrl('/dashboard');
        }
      }
    })

  }

  verifyLinkedInLogin(){
    this._authService.verifyLinkedInLogin(this.queryString).subscribe((res:SsoAuth)=>{
      if(res.error){
        this._utilityService.showErrorMessage('Linkedin Login',res.message);
        this._route.navigateByUrl('');
      }
      else{
        if(res.is_two_factor_auth_enabled){
          AuthStore.setTwoFactorAuthenticationDetails(res);
          this._route.navigateByUrl('/two-factor-authentication')
        }
        else{
          this._authService.setToken(res);
          if (AuthStore.redirectUrl) {
            const url = AuthStore.redirectUrl;
            AuthStore.setRedirectUrl(null);
            this._route.navigateByUrl(url);
        } else this._route.navigateByUrl('/dashboard');
        }
      }
    })
  }

}
