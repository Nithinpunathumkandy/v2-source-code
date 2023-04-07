import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { NotificationSettings } from 'src/app/core/models/settings/email-notification-settings';

class Store {
    @observable
    private _notificationSettings: NotificationSettings[] = [];

    @observable
    loaded: boolean = false;

    @action
    setEmailNotificationSettings(notifications: NotificationSettings[]) {
        this._notificationSettings = notifications;
        this.loaded = true;
    }

    @computed
    get emailNotificationSettings(): NotificationSettings[] {
        return this._notificationSettings.slice();
    }


}

export const EmailNotificationSettingsStore = new Store();