import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import {UserSettingStore} from 'src/app/stores/human-capital/users/user-setting/user-setting.store';
import {UsersStore} from 'src/app/stores/human-capital/users/users.store';
import { Settings } from 'src/app/core/models/human-capital/users/user-setting';
@Injectable({
  providedIn: 'root'
})
export class UserSettingService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

  getUserSettings(params?:number): Observable<Settings[]> {
    return this._http.get<Settings[]>('/users/'+UsersStore.user_id+'/settings').pipe(
      map((res: Settings[]) => {
        UserSettingStore.setSettings(res);
        return res;
      })
    );
  }

  updateItem(data) {
    return this._http.put('/users/'+UsersStore.user_id+'/settings', data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', res['message']);
        this.getUserSettings().subscribe();
        return res;
      })
    );
  }
}
