import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ActiveDirectorySettingService } from 'src/app/core/services/settings/organization_settings/active-directory-setting/active-directory-setting.service';
import { LoginSettingsService } from 'src/app/core/services/settings/organization_settings/login-settings/login-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { LoginSettingStore } from 'src/app/stores/settings/login-settings.store';
declare var $:any

@Component({
  selector: 'app-login-settings',
  templateUrl: './login-settings.component.html',
  styleUrls: ['./login-settings.component.scss']
})
export class LoginSettingsComponent implements OnInit {

  @ViewChild ('formModal',{static:true}) formModal: ElementRef;
  
  loginForm:FormGroup;
  AppStore = AppStore;
  AuthStore = AuthStore;
  LoginSettingStore = LoginSettingStore;
  buttonDisabled:boolean = true;
  formErrors: any;

  activeDirectorySettingObject: any = {
    type: '',
    values: null,
    page: false,
  }

  activeDirectorySettingModalEventSubsceiption: any;
  
  constructor(private _formBuilder:FormBuilder,
    private _loginSettingService:LoginSettingsService,
    private _helperService:HelperServiceService,
    private _utilityService:UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _activeDirectorySettingService: ActiveDirectorySettingService,
    private _cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getItems();

    this.loginForm = this._formBuilder.group({
      password_history_count: [null,Validators.required],
      is_password_validity_enabled:[null],
      password_validity_days: [null,Validators.required],
      password_validity_reminder_days:[null,Validators.required],
      is_user_account_block_enabled: [null],
      is_active_directory_enabled: [null],
      user_account_block_duration: [null,Validators.required],
    })
    
    this.activeDirectorySettingModalEventSubsceiption = this._eventEmitterService.activeDirectorySettingModal.subscribe(res => {
      this.closeFormModal();
    })
  }

  getItems(){
    this._loginSettingService.getItems().subscribe(()=> this.setFormValues())
  }

  setFormValues(){
    let loginSettingValue = LoginSettingStore?.loginSettingsItems;
    this.loginForm.setValue({
      // id: loginSettingValue?.id,
      is_password_validity_enabled:loginSettingValue?.is_password_validity_enabled ? true : false,
      is_user_account_block_enabled: loginSettingValue?.is_user_account_block_enabled ? true : false,
      is_active_directory_enabled: loginSettingValue?.is_active_directory_enabled ? true : false,
      password_history_count: loginSettingValue?.password_history_count,
      password_validity_days: loginSettingValue?.password_validity_days ,
      password_validity_reminder_days: loginSettingValue?.password_validity_reminder_days,
      user_account_block_duration: loginSettingValue?.user_account_block_duration 
    })
  }

  submit(){
    if (this.loginForm.value) {
      let save;
      AppStore.enableLoading();
      save = this._loginSettingService.updateItem(this.loginForm.value);
      save.subscribe((res: any) => {
        this.buttonDisabled = true;
        this.getItems();
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
          this.buttonDisabled = true;
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        }
      });
    }
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  enableSaveButton(event?: any, data?: any) {
    this.buttonDisabled = false;
    if (event.target.checked == true && data == 1) {
      this.addActiveDirectorySetting();
    } 
    else if (event.target.checked == true && data == 0) {
      this.editActiveDirectorySetting();
    }
  }

  addActiveDirectorySetting(){
    this.activeDirectorySettingObject.type = 'Add';
    this.activeDirectorySettingObject.values=null;
     this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
    }

  editActiveDirectorySetting() {
      this._activeDirectorySettingService.getItem().subscribe(res => {
        if(res){
          this.activeDirectorySettingObject.values = res;
          this.activeDirectorySettingObject.type = 'Edit';
          this._utilityService.detectChanges(this._cdr);
          this.openFormModal();
        }
      })
    }

  openFormModal() {
    $(this.formModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.activeDirectorySettingObject.type = '';
    this.getItems();
  } 

     /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof LoginSettingsComponent
   */
      ngOnDestroy() {
        this.activeDirectorySettingModalEventSubsceiption.unsubscribe();
    }


}
