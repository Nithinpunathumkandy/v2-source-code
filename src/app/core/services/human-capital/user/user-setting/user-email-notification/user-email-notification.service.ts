import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EmailNotification } from 'src/app/core/models/human-capital/users/user-setting';
import {UserEmailNotificationStore} from 'src/app/stores/human-capital/users/user-setting/user-email-notification.store';
import {UsersStore} from 'src/app/stores/human-capital/users/users.store';
@Injectable({
  providedIn: 'root'
})
export class UserEmailNotificationService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

  getEmailNotification(params?:number): Observable<EmailNotification[]> {
    return this._http.get<EmailNotification[]>('/users/'+UsersStore.user_id+'/email-notifications').pipe(
      map((res: EmailNotification[]) => {
        UserEmailNotificationStore.setEmailNotification(res);
        return res;
      })
    );
  }

  emailNotificationStatus(id,status) {
    return this._http.put('/users/'+UsersStore.user_id+'/email-notifications/'+id+'/'+status, status).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', res['message']);
        this.getEmailNotification().subscribe();
        return res;
      })
    );
  }

  moduleNotificationStatus(id,status) {
    return this._http.put('/users/'+UsersStore.user_id+'/email-notifications/module-group/'+id+'/'+status, status).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success',  res['message']);
        this.getEmailNotification().subscribe();
        return res;
      })
    );
  }

  updateAllEmailNotificationStatus(status) {
    return this._http.put('/users/'+UsersStore.user_id+'/email-notifications/'+status, status).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', res['message']);
        this.getEmailNotification().subscribe();
        return res;
      })
    );
  }

}
