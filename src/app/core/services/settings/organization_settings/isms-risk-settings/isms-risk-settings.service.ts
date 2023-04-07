import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISMSRiskSettings } from 'src/app/core/models/settings/isms-risk-settings.model';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { ISMSRiskSettingStore } from 'src/app/stores/settings/isms-risk-settings.store';

@Injectable({
  providedIn: 'root'
})
export class IsmsRiskSettingsService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService) { }

  updateItem(value){
    return this._http.put('/isms-risk-settings',value).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', res['message']);
        return res;
      })
    );
  }

  getItems():Observable<ISMSRiskSettings>{
    return this._http.get<ISMSRiskSettings>('/isms-risk-settings').pipe(
      map((res:ISMSRiskSettings) => {
        ISMSRiskSettingStore.setISMSRiskSettings(res)
        return res;
      })
    );
  }

}
