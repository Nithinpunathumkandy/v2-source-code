import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { StrategyManagementSettings } from 'src/app/core/models/settings/strategy-management-settings';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';

@Injectable({
  providedIn: 'root'
})
export class StrategyManagementSettingsServiceService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService) { }

  updateItem(value){
    return this._http.put('/strategy-management-settings',value).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', res['message']);
        return res;
      })
    );
  }

  getItems():Observable<StrategyManagementSettings>{
    return this._http.get<StrategyManagementSettings>('/strategy-management-settings').pipe(
      map((res:StrategyManagementSettings) => {
        StrategyManagementSettingStore.setStrategyManagementSettings(res)
        return res;
      })
    );
  }

}
