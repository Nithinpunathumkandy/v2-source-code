import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AssetManagementSettingsService } from 'src/app/core/services/settings/organization_settings/asset-management-settings/asset-management-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { AssetManagementSettingStore } from 'src/app/stores/settings/asset-settings-store';

@Component({
  selector: 'app-asset-management',
  templateUrl: './asset-management.component.html',
  styleUrls: ['./asset-management.component.scss']
})
export class AssetManagementComponent implements OnInit {

  AssetManagementSettingStore = AssetManagementSettingStore;
  formErrors=null;
  AppStore = AppStore;
  AuthStore = AuthStore;
  assetObject = {
    is_asset_depreciation: null,
    is_asset_contain: null,
  };
  constructor(private _assetManagementService:AssetManagementSettingsService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _helperService:HelperServiceService) { }

  ngOnInit(): void {
    this.getdetails();
  }

  getdetails(){
    this._assetManagementService.getItems().subscribe(()=>{this.setObjectValues()})
  }

  setObjectValues(){
    this.assetObject.is_asset_depreciation = AssetManagementSettingStore?.assetManagementSettings?.is_asset_depreciation ==1 ? true : false;
    this.assetObject.is_asset_contain = AssetManagementSettingStore?.assetManagementSettings?.is_asset_contain ==1 ? true : false;
    
    this._utilityService.detectChanges(this._cdr);
  }

  updateData(event,type){
    if(type == 'is_asset_depreciation')
    this.assetObject.is_asset_depreciation = event.target.checked;
    else if(type == 'is_asset_contain')
    this.assetObject.is_asset_contain = event.target.checked;

    }

    save(){
      this.formErrors=null;
      AppStore.enableLoading();
      this._assetManagementService.updateItem(this.assetObject).subscribe(()=>{
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
