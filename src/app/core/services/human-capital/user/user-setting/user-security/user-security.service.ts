import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { UserSecurityStore } from 'src/app/stores/human-capital/users/user-setting/user-security.store';

@Injectable({
  providedIn: 'root'
})
export class UserSecurityService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

    getTwoFactorAuthenticationStatus(): Observable<any> {
      return this._http.get<any>('/users/'+UsersStore.user_id+'/two-factor').pipe(
        map((res: any) => {
          UserSecurityStore.setVerificationStatus(res);
          return res;
        })
      );
    }

   

  updateItem(item): Observable<any> {
    return this._http.put('/users/'+UsersStore.user_id+'/security/change-password' ,item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        return res;
      })
    );
  }

  updateStatus(status): Observable<any> {
    // console.log(status);
    return this._http.put('/users/'+UsersStore.user_id+'/two-factor/'+status,status).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', res['message']);
        return res;
      })
    );
  }
}
