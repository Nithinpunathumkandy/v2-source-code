import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RiskManagementSettingsService } from 'src/app/core/services/settings/organization_settings/risk-management-settings/risk-management-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { RiskManagementSettingStore } from 'src/app/stores/settings/risk-management-settings.store';

@Component({
  selector: 'app-risk-management-settings',
  templateUrl: './risk-management-settings.component.html',
  styleUrls: ['./risk-management-settings.component.scss']
})
export class RiskManagementSettingsComponent implements OnInit {

  RiskManagementSettingStore = RiskManagementSettingStore;
  formErrors=null;
  AppStore = AppStore;
  AuthStore = AuthStore;
  riskObject = {
    is_control_efficiency: null,
    is_budget: null,
    is_root_cause_analysis:null,
    treatment_max_budget:null
  };
  constructor(private _riskManagementService:RiskManagementSettingsService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _helperService:HelperServiceService) { }

  ngOnInit(): void {
    this.getdetails();
  }

  getdetails(){
    this._riskManagementService.getItems().subscribe(()=>{this.setObjectValues()})
  }

  setObjectValues(){
    this.riskObject.is_control_efficiency = RiskManagementSettingStore?.riskManagementSettings?.is_control_efficiency ==1 ? true : false;
    this.riskObject.is_budget = RiskManagementSettingStore?.riskManagementSettings?.is_budget ==1 ? true : false;
    this.riskObject.is_root_cause_analysis= RiskManagementSettingStore?.riskManagementSettings?.is_root_cause_analysis ==1 ? true : false;
    this.riskObject.treatment_max_budget=RiskManagementSettingStore?.riskManagementSettings.treatment_max_budget?RiskManagementSettingStore?.riskManagementSettings.treatment_max_budget:0;
    this._utilityService.detectChanges(this._cdr);
  }

  updateData(event,type){
    if(type == 'is_control_efficiency')
    this.riskObject.is_control_efficiency = event.target.checked;
    else if(type == 'is_budget')
    this.riskObject.is_budget = event.target.checked;
    else if(type == 'is_root_cause_analysis')
    this.riskObject.is_root_cause_analysis = event.target.checked;

    }

    save(){
      this.formErrors=null;
      AppStore.enableLoading();
      this._riskManagementService.updateItem(this.riskObject).subscribe(()=>{
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
        
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          // AppStore.disableLoading();
          this.formErrors = err.error.errors;
          
        }
        // else if(err.status == 500 || err.status==404){
        //   this.closeFormModal();
        //   AppStore.disableLoading();
        // }
        else {
          this._utilityService.showErrorMessage('Error', 'Something Went Wrong Try Again Later');
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      })
 
    }
      //getting button name by language
getButtonText(text){
  return this._helperService.translateToUserLanguage(text);
}
}
