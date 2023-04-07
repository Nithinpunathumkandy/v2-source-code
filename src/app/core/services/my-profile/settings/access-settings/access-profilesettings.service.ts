import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccessSettings } from 'src/app/core/models/my-profile/settings/access-settings';
import { AccessSettingStore } from 'src/app/stores/my-profile/settings/access-settings.store';

@Injectable({
  providedIn: 'root'
})
export class AccessProfilesettingsService {

  constructor(private _http:HttpClient) { }

  getItems(params?:string): Observable<AccessSettings[]> {
    return this._http.get<AccessSettings[]>('/users/me/accesses/'+(params?params:'')).pipe(
      map((res: AccessSettings[]) => {
        // UserAccessStore.setAccesses(res,params);
        // if(UsersStore.user_id == AuthStore.user.id)
          AccessSettingStore.setAccesses(res,params);
        return res;
      })
    );  
  }
}
