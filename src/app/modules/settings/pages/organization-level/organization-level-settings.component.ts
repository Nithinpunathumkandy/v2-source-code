import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse } from '@angular/common/http';
import { OrganizationLevelSettingsService } from 'src/app/core/services/settings/organization-settings/organization-settings.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { AuthStore } from "src/app/stores/auth.store";

@Component({
  selector: 'app-organization-level-settings',
  templateUrl: './organization-level-settings.component.html',
  styleUrls: ['./organization-level-settings.component.scss']
})
export class OrganizationLevelSettingsComponent implements OnInit {
  reactionDisposer: IReactionDisposer;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  AuthStore = AuthStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;


  constructor(private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _organizationLevelSettingsService: OrganizationLevelSettingsService) { }

  ngOnInit() {
    // this.reactionDisposer = autorun(() => {

    //   setTimeout(() => {
    //     //this.form.pristine;
    //     this.formErrors = null;
    //     this._utilityService.detectChanges(this._cdr);

    //   }, 1000);

    // })
    AppStore.disableLoading();
    this._organizationLevelSettingsService.getAllItems().subscribe((res: any) => {
      this._utilityService.detectChanges(this._cdr);
    });
    // , (err: HttpErrorResponse) => {
    //   if (err.status == 422) {
    //     this.formErrors = err.error.errors;
    //     AppStore.disableLoading()
    //   }
    // });

  }

  changeOrganizationSettings(settings, isChecked: boolean) {
    let settings_status;

    AppStore.enableLoading();
    if (isChecked) {
      settings_status = this._organizationLevelSettingsService.activateSettings(settings);
    }
    else {
      settings_status = this._organizationLevelSettingsService.deactivateSettings(settings);
    }
    
    settings_status.subscribe((res: any) => {
      AppStore.disableLoading();
      
      this._utilityService.detectChanges(this._cdr);

    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading()
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      }
    });

  }

}
