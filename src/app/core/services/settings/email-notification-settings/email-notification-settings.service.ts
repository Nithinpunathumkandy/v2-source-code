import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NotificationSettings } from "src/app/core/models/settings/email-notification-settings";
import { EmailNotificationSettingsStore } from "src/app/stores/settings/email-notification-settings.store";

@Injectable({
  providedIn: 'root'
})
export class EmailNotificationSettingsService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  getItems(params?: string){
    return this._http.get<NotificationSettings[]>('/email-notifications' + (params ? params : '')).pipe(
      map((res: NotificationSettings[]) => {
        EmailNotificationSettingsStore.setEmailNotificationSettings(res)
        return res;
      })
    );
  }

  activateNotification(id: number){
    return this._http.put('/email-notifications/module-group/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','notification_activated');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  deactivateNotification(id: number){
    return this._http.put('/email-notifications/module-group/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','notification_deactivated');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  activateSubNotification(id: number){
    return this._http.put('/email-notifications/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','notification_activated');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  deactivateSubNotification(id: number){
    return this._http.put('/email-notifications/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','notification_deactivated');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  activateEmailNotification(){
    return this._http.put('/email-notifications/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','notification_activated');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  deactivateEmailNotification(){
    return this._http.put('/email-notifications/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','notification_deactivated');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

}
