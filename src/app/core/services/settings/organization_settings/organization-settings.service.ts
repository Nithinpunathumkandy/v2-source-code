import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { OrganizationGeneralSettings } from 'src/app/core/models/settings/organization-general-settings';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";

@Injectable({
  providedIn: 'root'
})
export class OrganizationSettingsService {

  constructor( private _http: HttpClient,
    private _utilityService: UtilityService) { }



    getOrganizationSettings(id?): Observable<OrganizationGeneralSettings> {
      return this._http.get<OrganizationGeneralSettings>('/organizations/primary/settings').pipe((
        map((res:any)=>{
          let settings = null
          if(res.length > 0){
            settings = JSON.parse(JSON.stringify(res[0]));
            settings['autolock_seconds'] = typeof(res[0]['autolock_seconds']) == "string" ? parseInt(res[0]['autolock_seconds']) : res[0]['autolock_seconds'];
            settings['is_autolock'] = typeof(res[0]['is_autolock']) == "string" ? parseInt(res[0]['is_autolock']) : res[0]['is_autolock'];
            settings['is_chatbot'] = typeof(res[0]['is_chatbot']) == "string" ? parseInt(res[0]['is_chatbot']) : res[0]['is_chatbot'];
            settings['is_faq'] = typeof(res[0]['is_faq']) == "string" ? parseInt(res[0]['is_faq']) : res[0]['is_faq'];
            settings['is_feedback'] = typeof(res[0]['is_feedback']) == "string" ? parseInt(res[0]['is_feedback']) : res[0]['is_feedback'];
            settings['is_ms_type'] = typeof(res[0]['is_ms_type']) == "string" ? parseInt(res[0]['is_ms_type']) : res[0]['is_ms_type'];
            settings['is_user_license_activation'] = typeof(res[0]['is_user_license_activation']) == "string" ? parseInt(res[0]['is_user_license_activation']) : res[0]['is_user_license_activation'];
            settings['is_user_reward'] = typeof(res[0]['is_user_reward']) == "string" ? parseInt(res[0]['is_user_reward']) : res[0]['is_user_reward'];
            OrganizationGeneralSettingsStore.setOrganizationSettings(settings);
          }
          return settings;
        })
      ))
    }
  


    updateItem(id:number, item:OrganizationGeneralSettings): Observable<any> {
      return this._http.put('/organizations/primary/settings', item).pipe(
        map((res:any )=> {
          this.getOrganizationSettings(1);
          this._utilityService.showSuccessMessage('success','organization_settings_updated');
          return res;
        })
      );
    }
}

