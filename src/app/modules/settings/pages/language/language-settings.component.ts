import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { LanguageService } from 'src/app/core/services/settings/languages/language.service';
import { LanguageSettingsStore } from 'src/app/stores/settings/language-settings.store';
import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthStore } from "src/app/stores/auth.store";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-language-settings',
  templateUrl: './language-settings.component.html',
  styleUrls: ['./language-settings.component.scss']
})
export class LanguageSettingsComponent implements OnInit {

  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  AuthStore = AuthStore;
  LanguageSettingsStore = LanguageSettingsStore;
  constructor(private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _languageService: LanguageService) { }

  ngOnInit() {
    this.form = this._formBuilder.group({
      id: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      is_primary: ['', [Validators.maxLength(255)]]
    });
    this._languageService.getAllItems(true).subscribe();
  }

  changeLanguageStatus(lang, isChecked: boolean) {
    let lang_status;
    this.form.reset();
    this.form.setValue({
      id: lang.id,
      title: lang.title,
      is_primary: lang.is_primary
    });

    AppStore.enableLoading();
    if (isChecked) {
      lang_status = this._languageService.activateLanguage(lang.id, this.form.value);
    }
    else {
      lang_status = this._languageService.deactivateLanguage(lang.id, this.form.value);
    }
    lang_status.subscribe((res: any) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      }
      this._utilityService.detectChanges(this._cdr);
    });

  }

  setPrimary(lang) {
    if (lang.status_id != 1 && lang.is_primary == 0) {
      this._utilityService.showWarningMessage('', 'cannot_set_deactive_language_primary');
    }
    else {
      AppStore.enableLoading();
      this._languageService.setPrimary(lang.id, this.form.value).subscribe((res: any) => {
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
        window.location.reload();
      }, (err: HttpErrorResponse) => {
        AppStore.disableLoading()
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }



}
