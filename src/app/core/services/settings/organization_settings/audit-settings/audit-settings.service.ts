import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuditSettings } from 'src/app/core/models/settings/audit-settings.model';
import { AuditSettingStore } from 'src/app/stores/settings/audit-settings.store';

@Injectable({
  providedIn: 'root'
})
export class AuditSettingsService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }


    getItems():Observable<AuditSettings>{
      return this._http.get<AuditSettings>('/audit-settings').pipe(
        map((res:AuditSettings ) => {
          AuditSettingStore.setAuditSettings(res)
          return res;
        })
      );
    }

    updateItem(value){
      return this._http.put('/audit-settings',value).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', res['message']);
          return res;
        })
      );
    }
}
