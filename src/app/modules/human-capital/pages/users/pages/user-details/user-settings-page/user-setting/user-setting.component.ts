import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { AppStore } from 'src/app/stores/app.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UserSettingService } from 'src/app/core/services/human-capital/user/user-setting/user-setting/user-setting.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/core/services/settings/languages/language.service';
import {LanguageSettingsStore} from 'src/app/stores/settings/language-settings.store';
import { TimezonesService } from 'src/app/core/services/settings/timezones/timezones.service';
import {TimezonesStore} from 'src/app/stores/settings/timezones.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss']
})
export class UserSettingComponent implements OnInit {
  form: FormGroup;
  AppStore = AppStore;
  formErrors: any;
  LanguageSettingsStore = LanguageSettingsStore;
  TimezonesStore = TimezonesStore;
  AuthStore = AuthStore;

  timeoutTimeList = [
    { title: '1 Min', value: 60 },
    { title: '2 Min', value: 120 },
    { title: '3 Min', value: 180 },
    { title: '5 Min', value: 300 },
    { title: '10 Min', value: 600 },
    { title: '15 Min', value: 900 },
    { title: '30 Min', value: 1800 }
  ]

  constructor(private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _userSettingService: UserSettingService,
    private _languageService:LanguageService,
    private _helperService:HelperServiceService,
    private _timezoneService:TimezonesService) { }


  ngOnInit(): void {

    // Form Object to add Control Category

    this.form = this._formBuilder.group({
      default_language_id: [''],
      timezone_id: [''],
      is_autolock : false,
      autolock_seconds: ['']
    });

    this._languageService.getAllItems().subscribe(res=>{this._utilityService.detectChanges(this._cdr)});
    this._timezoneService.getAllItems().subscribe(res=>{this._utilityService.detectChanges(this._cdr)});

    // calling organization data
    this.getUserSettings();

    this.resetForm();

  }


  // for resetting the form
  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
  }

  // cancel modal
  cancel() {
    // FormErrorStore.setErrors(null);
    this.resetForm();
    this._router.navigateByUrl('../');

  }

  // getting defualt settings
  getUserSettings() {
    this._userSettingService.getUserSettings().subscribe(res => {
       this.form.setValue({
         default_language_id: typeof(res[0].default_language_id) == "string" ? parseInt(res[0].default_language_id) : res[0].default_language_id,
         timezone_id: typeof(res[0].timezone_id) == "string" ? parseInt(res[0].timezone_id) : res[0].timezone_id,
         is_autolock: typeof(res[0].is_autolock) == "string" ? parseInt(res[0].is_autolock) : res[0].is_autolock,
         autolock_seconds: typeof(res[0].autolock_seconds) == "string" ? parseInt(res[0].autolock_seconds) : res[0].autolock_seconds
       })
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // save button enable/disable function
  
  // function for add & update
  save(close: boolean = false) {

    this.formErrors = null;
    if (this.form.value) {
      this.processSaveData();
      AppStore.enableLoading();
      this._userSettingService.updateItem(this.form.value).subscribe((res: any) => {
        this.ngOnInit(); // calling to refresh page and disable save button after successfull api call
        AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);

      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        }
      });
    }
  }

  processSaveData(){
    if(this.form.value.autolock_seconds)
      this.form.patchValue({is_autolock: true});
    else
      this.form.patchValue({is_autolock: false});
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

}
