import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssetManagementSettings } from 'src/app/core/models/settings/asset-settings';
import { AssetManagementSettingStore } from 'src/app/stores/settings/asset-settings-store';

@Injectable({
  providedIn: 'root'
})
export class AssetManagementSettingsService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService
  ) { }

  getItems():Observable<AssetManagementSettings>{
    return this._http.get<AssetManagementSettings>('/asset-settings').pipe(
      map((res:AssetManagementSettings) => {
        let assetSettings = JSON.parse(JSON.stringify(res));

        assetSettings['is_asset_depreciation']=typeof(res['is_asset_depreciation']) == "string" ? parseInt(res['is_asset_depreciation']) : res['is_asset_depreciation'];
        assetSettings['is_asset_contain']=typeof(res['is_asset_contain']) == "string" ? parseInt(res['is_asset_contain']) : res['is_asset_contain'];
        AssetManagementSettingStore.setAssetManagementSettings(assetSettings)
        return res;
      })
    );
  }

  updateItem(value){
    return this._http.put('/asset-settings',value).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', res['message']);
        return res;
      })
    );
  }
}
