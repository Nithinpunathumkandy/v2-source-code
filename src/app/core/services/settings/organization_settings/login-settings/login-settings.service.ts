import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { LoginSettingStore } from 'src/app/stores/settings/login-settings.store';
import { LoginSettings } from 'src/app/core/models/settings/login-settings.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginSettingsService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService) { }

    getItems():Observable<LoginSettings>{
      return this._http.get<LoginSettings>('/organization-login-settings').pipe(
        map((res:LoginSettings) => {
          let loginSettings = res;
          loginSettings['is_active_directory_enabled'] = typeof(res['is_active_directory_enabled']) == "string" ? parseInt(res['is_active_directory_enabled']) : res['is_active_directory_enabled'];
          loginSettings['is_password_validity_enabled'] = typeof(res['is_password_validity_enabled']) == "string" ? parseInt(res['is_password_validity_enabled']) : res['is_password_validity_enabled'];
          loginSettings['is_user_account_block_enabled'] = typeof(res['is_user_account_block_enabled']) == "string" ? parseInt(res['is_user_account_block_enabled']) : res['is_user_account_block_enabled'];
          LoginSettingStore.setLoginSettings(loginSettings)
          return res;
        })
      );
    }

    updateItem(value){
      return this._http.put('/organization-login-settings',value).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', res['message']);
          return res;
        })
      );
    }
}
