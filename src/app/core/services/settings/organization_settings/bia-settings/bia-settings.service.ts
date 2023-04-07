import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BiaSettings } from 'src/app/core/models/settings/bia-settings';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BiaSettingStore } from 'src/app/stores/settings/bia-settings.store';

@Injectable({
  providedIn: 'root'
})
export class BiaSettingsService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService) { }

  getItems():Observable<BiaSettings>{
    return this._http.get<BiaSettings>('/bcm-settings').pipe(
      map((res:BiaSettings) => {
        let bcmSettings = res;
        bcmSettings['is_impact_area'] = typeof(res['is_impact_area']) == "string" ? parseInt(res['is_impact_area']) : res['is_impact_area'];
        bcmSettings['is_impact_scenario'] = typeof(res['is_impact_scenario']) == "string" ? parseInt(res['is_impact_scenario']) : res['is_impact_scenario'];
        BiaSettingStore.setBiaSettings(bcmSettings);
        return res;
      })
    );
  }

  updateItem(value){
    return this._http.put('/bcm-settings',value).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bcm_settings_updated');
        return res;
      })
    );
  }
}
