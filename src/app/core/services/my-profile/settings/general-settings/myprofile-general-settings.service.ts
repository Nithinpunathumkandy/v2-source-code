import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UserGeneralSettingStore } from 'src/app/stores/my-profile/settings/myprofile-general-settings.store';

@Injectable({
  providedIn: 'root'
})
export class MyprofileGeneralSettingsService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService) { }

  getUserSettings() {
    return this._http.get('/users/me/general-settings').pipe(
      map((res) => {
        UserGeneralSettingStore.setSettings(res);
        return res;
      })
    );
  }

  updateItem(data) {
    return this._http.put('/users/me/general-settings', data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', res['message']);
        this.getUserSettings().subscribe();
        return res;
      })
    );
  }
}
