import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { IsmsRiskSettingsService } from 'src/app/core/services/settings/organization_settings/isms-risk-settings/isms-risk-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ISMSRiskSettingStore } from 'src/app/stores/settings/isms-risk-settings.store';

@Component({
  selector: 'app-isms-risk-settings',
  templateUrl: './isms-risk-settings.component.html',
  styleUrls: ['./isms-risk-settings.component.scss']
})
export class IsmsRiskSettingsComponent implements OnInit {

  ISMSRiskSettingStore = ISMSRiskSettingStore
  formErrors=null;
  AppStore = AppStore;
  AuthStore = AuthStore;
  ismsRiskObject = {
    is_control_efficiency: null,
    is_budget: null,
    is_root_cause_analysis:null,
    is_asset:null,
    is_asset_category:null
  };

  constructor(private _ismsRiskService:IsmsRiskSettingsService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _helperService:HelperServiceService) { }

  ngOnInit(): void {
    this.getdetails();
  }

  getdetails(){
    this._ismsRiskService.getItems().subscribe(()=>{this.setObjectValues()})
  }

  setObjectValues(){
    this.ismsRiskObject.is_control_efficiency = ISMSRiskSettingStore?.ismsRiskSettings?.is_control_efficiency ==1 ? true : false;
    this.ismsRiskObject.is_budget = ISMSRiskSettingStore?.ismsRiskSettings?.is_budget ==1 ? true : false;
    this.ismsRiskObject.is_root_cause_analysis = ISMSRiskSettingStore?.ismsRiskSettings?.is_root_cause_analysis ==1 ? true : false;
    this.ismsRiskObject.is_asset = ISMSRiskSettingStore?.ismsRiskSettings?.is_asset ==1 ? true : false;
    this.ismsRiskObject.is_asset_category = ISMSRiskSettingStore?.ismsRiskSettings?.is_asset_category ==1 ? true : false;
    this._utilityService.detectChanges(this._cdr);
  }

  updateData(event, type) {
    if (type == 'is_control_efficiency')
      this.ismsRiskObject.is_control_efficiency = event.target.checked;
    else if (type == 'is_budget')
      this.ismsRiskObject.is_budget = event.target.checked;
    else if (type == 'is_root_cause_analysis')
      this.ismsRiskObject.is_root_cause_analysis = event.target.checked;
    else if (type == 'is_asset'){
      this.ismsRiskObject.is_asset = event.target.checked;
      this.ismsRiskObject.is_asset_category = this.ismsRiskObject.is_asset == false ? true : false ;
    }
    else if (type == 'is_asset_category'){
      this.ismsRiskObject.is_asset_category = event.target.checked;
      this.ismsRiskObject.is_asset = this.ismsRiskObject.is_asset_category == false ? true : false ;
    }
  }

  save(){
    this.formErrors=null;
    AppStore.enableLoading();
    this._ismsRiskService.updateItem(this.ismsRiskObject).subscribe(()=>{
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
