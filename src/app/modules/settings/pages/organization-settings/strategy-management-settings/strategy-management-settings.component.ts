import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { StrategyManagementSettingsServiceService } from 'src/app/core/services/settings/organization_settings/strategy-management-settings/strategy-management-settings-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';

@Component({
  selector: 'app-strategy-management-settings',
  templateUrl: './strategy-management-settings.component.html',
  styleUrls: ['./strategy-management-settings.component.scss']
})
export class StrategyManagementSettingsComponent implements OnInit {

  formErrors=null;
  AppStore = AppStore;
  AuthStore = AuthStore;
  strategySettingsObject = {
    is_weightage: null,
    is_fractional_part: null,
    is_activate:null,
    is_passivate:null,
    is_weightage_fraction:null,
    is_target_fraction:null,
  };

  constructor(private _strategyManagementService:StrategyManagementSettingsServiceService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _helperService:HelperServiceService) { }

  ngOnInit(): void {
    this.getdetails();
  }

  getdetails(){
    this._strategyManagementService.getItems().subscribe(()=>{this.setObjectValues()})
  }

  setObjectValues(){
    this.strategySettingsObject.is_weightage = StrategyManagementSettingStore?.strategyManagementSettings?.is_weightage ==1 ? true : false;
    this.strategySettingsObject.is_activate = StrategyManagementSettingStore?.strategyManagementSettings?.is_activate ==1 ? true : false;
    this.strategySettingsObject.is_passivate = StrategyManagementSettingStore?.strategyManagementSettings?.is_passivate ==1 ? true : false;
    this.strategySettingsObject.is_fractional_part = StrategyManagementSettingStore?.strategyManagementSettings?.is_fractional_part ==1 ? true : false;
    this.strategySettingsObject.is_weightage_fraction = StrategyManagementSettingStore?.strategyManagementSettings?.is_weightage_fraction ==1 ? true : false;
    this.strategySettingsObject.is_target_fraction = StrategyManagementSettingStore?.strategyManagementSettings?.is_target_fraction ==1 ? true : false;
    this._utilityService.detectChanges(this._cdr);
  }

  updateData(event, type) {
    switch (type) {
      case 'is_weightage':
        this.strategySettingsObject.is_weightage = event.target.checked;
        break;
      case 'is_passivate':
        this.strategySettingsObject.is_passivate = event.target.checked;
        break;
      case 'is_activate':
        this.strategySettingsObject.is_activate = event.target.checked;
        break;
      case 'is_fractional_part':
        this.strategySettingsObject.is_fractional_part = event.target.checked;
        this.strategySettingsObject.is_weightage_fraction = event.target.checked;
        this.strategySettingsObject.is_target_fraction = event.target.checked;
        break;
      case 'is_weightage_fraction':
        this.strategySettingsObject.is_weightage_fraction = event.target.checked;
        if(event.target.checked == false)
        this.strategySettingsObject.is_fractional_part = false;
        break;
      case 'is_target_fraction':
        this.strategySettingsObject.is_target_fraction = event.target.checked;
        if(event.target.checked == false)
        this.strategySettingsObject.is_fractional_part = false;
        break;
    }
  }

  save(){
    this.formErrors=null;
    AppStore.enableLoading();
    this._strategyManagementService.updateItem(this.strategySettingsObject).subscribe(()=>{
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        // AppStore.disableLoading();
        this.formErrors = err.error.errors;       
      }
      else {
        this._utilityService.showErrorMessage('Error', 'Something Went Wrong Try Again Later');
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

}
