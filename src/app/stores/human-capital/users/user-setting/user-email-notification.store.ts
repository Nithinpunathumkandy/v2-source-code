import { observable, action, computed } from "mobx-angular";
import { EmailNotification } from 'src/app/core/models/human-capital/users/user-setting';

class Store {
    @observable
    private _emailNotificationList: EmailNotification[] = [];
  
    @observable
    loaded: boolean = false;


    @action
    setEmailNotification(response: EmailNotification[]) {
        this._emailNotificationList = response;
        this.loaded = true;
    }

   
    get emailNotificationDetails(): EmailNotification[] {

        return this._emailNotificationList.slice();
    }

}

export const UserEmailNotificationStore = new Store();