import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppStore } from 'src/app/stores/app.store';
import { IReactionDisposer} from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse} from '@angular/common/http';
import {UserSecurityService} from 'src/app/core/services/human-capital/user/user-setting/user-security/user-security.service';
import {UserSecurityStore} from 'src/app/stores/human-capital/users/user-setting/user-security.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {
  reactionDisposer: IReactionDisposer;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  UserSecurityStore = UserSecurityStore;
  togglePassword: boolean = false;
  changePassword = true;
  authentication = false;
  AuthStore = AuthStore;

  constructor(private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _userSecurityService:UserSecurityService,
    private _helperService:HelperServiceService) { }

  ngOnInit() {
    AppStore.disableLoading();
    this.form = this._formBuilder.group({
      // old_password: ['', [Validators.required]],
      new_password: ['', [Validators.required]],
      new_password_confirmation: ['', [Validators.required]]
      
    });
    this.getData();
  }

  getData(){
    this._userSecurityService.getTwoFactorAuthenticationStatus().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  cancel() {
    this.form.reset();
    this.form.markAsPristine();
    AppStore.disableLoading();
  }

  openChangePassword(){
    if(this.changePassword == true){
      this.changePassword = false;
    }
    else{
      this.authentication = false;
      this.changePassword = true;
    }
      
  }

  openAuthentication(){
    if(this.authentication == true)
      this.authentication = false;
    else{
      this.authentication = true;
      this.changePassword = false;
    }
      
  }

  save() {
    this.formErrors = null;
    AppStore.enableLoading();
    this._userSecurityService.updateItem(this.form.value)
    .subscribe((res: any) => {
      AppStore.disableLoading();
      this.form.reset();
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
    this.togglePassword = !this.togglePassword;
}
getButtonText(text){
  return this._helperService.translateToUserLanguage(text);
}

  setVerification(){
    let status;
    if(UserSecurityStore.verificationStatus == 'active')
      status = 'deactivate';
    else
      status = 'activate';
    this._userSecurityService.updateStatus(status).subscribe(res=>{
      this.getData();
      this._utilityService.detectChanges(this._cdr);
    })
  }
}
