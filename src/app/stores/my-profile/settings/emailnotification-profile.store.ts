import { observable, action, computed } from "mobx-angular";
import { EmailNotificationSettings } from 'src/app/core/models/my-profile/settings/email-notification-settings';

class Store {
    @observable
    private _emailNotificationList: EmailNotificationSettings[] = [];
  
    @observable
    loaded: boolean = false;

    @action
    setEmailNotification(response: EmailNotificationSettings[]) {
        this._emailNotificationList = response;
        this.loaded = true;
    }
 
    get emailNotificationDetails(): EmailNotificationSettings[] {
        return this._emailNotificationList.slice();
    }

}
export const EmailNotificationProfileStore = new Store();