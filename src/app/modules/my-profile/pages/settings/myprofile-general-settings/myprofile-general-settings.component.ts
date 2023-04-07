import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MyprofileGeneralSettingsService } from 'src/app/core/services/my-profile/settings/general-settings/myprofile-general-settings.service';
import { LanguageService } from 'src/app/core/services/settings/languages/language.service';
import { TimezonesService } from 'src/app/core/services/settings/timezones/timezones.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { LanguageSettingsStore } from 'src/app/stores/settings/language-settings.store';
import { TimezonesStore } from 'src/app/stores/settings/timezones.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-myprofile-general-settings',
  templateUrl: './myprofile-general-settings.component.html',
  styleUrls: ['./myprofile-general-settings.component.scss']
})
export class MyprofileGeneralSettingsComponent implements OnInit {

  AppStore =AppStore;
  AuthStore = AuthStore;
  form: FormGroup;
  formErrors: any;
  LanguageSettingsStore = LanguageSettingsStore;
  TimezonesStore = TimezonesStore;

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
    private _languageService:LanguageService,
    private _timezoneService:TimezonesService,
    private _helperService: HelperServiceService,
    private _generalSettingService:MyprofileGeneralSettingsService) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      default_language_id: [null],
      timezone_id: [null],
      is_autolock : false,
      autolock_seconds: [null]
    });
    this._languageService.getAllItems().subscribe(res=>{this._utilityService.detectChanges(this._cdr)});
    this._timezoneService.getAllItems().subscribe(res=>{this._utilityService.detectChanges(this._cdr)});

    this.getUserSettings();
    this.resetForm();
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
  }

  getUserSettings() {
    this._generalSettingService.getUserSettings().subscribe(res => {
       this.form.setValue({
         default_language_id: typeof(res[0].default_language_id) == "string" ?  parseInt(res[0].default_language_id) : res[0].default_language_id,
         timezone_id: typeof(res[0].timezone_id) == "string" ? parseInt(res[0].timezone_id) : res[0].timezone_id,
         is_autolock: typeof(res[0].is_autolock) == "string" ? parseInt(res[0].is_autolock) : res[0].is_autolock,
         autolock_seconds: typeof(res[0].autolock_seconds) == "string" ? parseInt(res[0].autolock_seconds) : res[0].autolock_seconds
       })
      this._utilityService.detectChanges(this._cdr);
    })
  }

  save(close: boolean = false) {

    this.formErrors = null;
    if (this.form.value) {
      this.processSaveData();
      AppStore.enableLoading();
      this._generalSettingService.updateItem(this.form.value).subscribe((res: any) => {
        this.ngOnInit();
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
