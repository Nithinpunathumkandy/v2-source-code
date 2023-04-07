import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuditManagementSettings } from 'src/app/core/models/settings/audit-management-settings';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditManagementSettingStore } from 'src/app/stores/settings/audit-management-store';

@Injectable({
  providedIn: 'root'
})
export class AuditManagementSettingsService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService
    ) { }


  getItems():Observable<AuditManagementSettings>{
    return this._http.get<AuditManagementSettings>('/am-audit-settings').pipe(
      map((res:AuditManagementSettings ) => {
        
        AuditManagementSettingStore.setAuditManagemntSettings(res);
        return res;
      })
    );
  }

  updateItem(value){
    return this._http.put('/am-audit-settings',value).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'audit_management_settings_updated_successfully');
        return res;
      })
    );
  }
}
