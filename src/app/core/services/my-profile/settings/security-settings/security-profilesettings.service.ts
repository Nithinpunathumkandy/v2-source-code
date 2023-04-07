import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProfileSecuritySettingStore } from 'src/app/stores/my-profile/settings/security-settings';

@Injectable({
  providedIn: 'root'
})
export class SecurityProfilesettingsService {

  constructor(private _http:HttpClient,
              private _utilityService:UtilityService) { }

  updateItem(item): Observable<any> {
    return this._http.put('/users/me/change-password' ,item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'password_reset_successful');
        return res;
      })
    );
  }

  updateStatus(status): Observable<any> {
    console.log(status);
    return this._http.put('/users/me/two-factor/'+status,status).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', status == 'activate'? 'two_factor_authentication_activated' : 'two_factor_authentication_deactivated');
        ProfileSecuritySettingStore.setVerificationStatusByEdit(status);
        return res;
      })
    );
  }

  getTwoFactorAuthenticationStatus(): Observable<any> {
    return this._http.get<any>('/users/me/two-factor').pipe(
      map((res: any) => {
        ProfileSecuritySettingStore.setVerificationStatus(res);
        return res;
      })
    );
  }
}
