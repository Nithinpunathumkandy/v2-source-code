import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { Acl } from 'src/app/core/models/human-capital/users/user-setting';
import { UserAclStore } from 'src/app/stores/human-capital/users/user-setting/user-acl.store';
import { AuthStore } from "src/app/stores/auth.store";

@Injectable({
  providedIn: 'root'
})
export class UserAclService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

  getItems(params?:number): Observable<Acl[]> {
    return this._http.get<Acl[]>('/users/'+UsersStore.user_id+'/activities').pipe(
      map((res: Acl[]) => {
        UserAclStore.setActivities(res);
        if(AuthStore.user.id == UsersStore.user_id)
          this.getUserActivityPermissions().subscribe();
        return res;
      })
    );
  }

  saveItem(data) {
    return this._http.put('/users/'+UsersStore.user_id+'/activities', data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        this.getItems().subscribe();
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
