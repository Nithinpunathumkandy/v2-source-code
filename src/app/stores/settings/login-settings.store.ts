
import { action, observable } from "mobx";
import { LoginSettings } from "src/app/core/models/settings/login-settings.model";

class Store {
    @observable
    private _loginSettingsItems: LoginSettings;

    @observable
    loaded: boolean = false;

    @action
    setLoginSettings(response: LoginSettings) {
        this._loginSettingsItems = response;
        this.loaded = true;
    }

    get loginSettingsItems(): LoginSettings { 
        return this._loginSettingsItems; 
    }
}
export const LoginSettingStore = new Store();