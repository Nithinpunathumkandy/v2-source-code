import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RiskManagementSettings } from 'src/app/core/models/settings/risk-management-settings.model';
import { RiskManagementSettingStore } from 'src/app/stores/settings/risk-management-settings.store';
@Injectable({
  providedIn: 'root'
})
export class RiskManagementSettingsService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService) { }

  getItems():Observable<RiskManagementSettings>{
    return this._http.get<RiskManagementSettings>('/risk-settings').pipe(
      map((res:RiskManagementSettings) => {
        let riskSettings = JSON.parse(JSON.stringify(res));
        riskSettings['is_budget'] = typeof(res['is_budget']) == "string" ? parseInt(res['is_budget']) : res['is_budget'];
        riskSettings['is_control_efficiency'] = typeof(res['is_control_efficiency']) == "string" ? parseInt(res['is_control_efficiency']) : res['is_control_efficiency'];
        riskSettings['is_root_cause_analysis'] = typeof(res['is_root_cause_analysis']) == "string" ? parseInt(res['is_root_cause_analysis']) : res['is_root_cause_analysis'];
        RiskManagementSettingStore.setRiskManagementSettings(riskSettings)
        return res;
      })
    );
  }

  updateItem(value){
    return this._http.put('/risk-settings',value).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', res['message']);
        return res;
      })
    );
  }

}
