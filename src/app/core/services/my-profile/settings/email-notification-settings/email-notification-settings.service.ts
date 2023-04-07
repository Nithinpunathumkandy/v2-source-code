import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmailNotificationSettings } from 'src/app/core/models/my-profile/settings/email-notification-settings';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EmailNotificationProfileStore } from 'src/app/stores/my-profile/settings/emailnotification-profile.store';

@Injectable({
  providedIn: 'root'
})
export class EmailNotificationSettingsService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

    getEmailNotification(params?:number): Observable<EmailNotificationSettings[]> {
      return this._http.get<EmailNotificationSettings[]>('/users/me/email-notifications').pipe(
        map((res: EmailNotificationSettings[]) => {
          EmailNotificationProfileStore.setEmailNotification(res);
          return res;
        })
      );
    }

    moduleNotificationStatus(id,status) {
      return this._http.put('/users/me/email-notifications/module-group/'+id+'/'+status, status).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success',  res['message']);
          this.getEmailNotification().subscribe();
          return res;
        })
      );
    }

    updateAllEmailNotificationStatus(status) {
      return this._http.put('/users/me/email-notifications/'+status, status).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', res['message']);
          // this.getEmailNotification().subscribe();
          return res;
        })
      );
    }

    emailNotificationStatus(id,status) {
      return this._http.put('/users/me/email-notifications/'+id+'/'+status, status).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', res['message']);
          this.getEmailNotification().subscribe();
          return res;
        })
      );
    }
}
