import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AclSettings } from 'src/app/core/models/my-profile/settings/acl-settings';
import { AuthStore } from 'src/app/stores/auth.store';
import { AclSettingStore } from 'src/app/stores/my-profile/settings/acl-setting.store';

@Injectable({
  providedIn: 'root'
})
export class AclProfilesettingService {

  constructor(private _http:HttpClient) { }

  getItems(params?:number): Observable<AclSettings[]> {
    return this._http.get<AclSettings[]>('/users/me/acl').pipe(
      map((res: AclSettings[]) => {
        AclSettingStore.setActivities(res);
        // if(AuthStore.user.id == UsersStore.user_id)
         this.getUserActivityPermissions().subscribe();
        return res;
      })
    );
  }

  getUserActivityPermissions(): Observable<any> {
    return this._http.get<any>('/users/me/activities').pipe(
      map((res: any) => {
        AuthStore.setUserPermissions(res);
        return res;
      })
    );
  }
}
