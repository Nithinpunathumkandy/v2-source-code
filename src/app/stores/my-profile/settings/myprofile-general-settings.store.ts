import { action, observable } from "mobx";

class Store {
    @observable
    private _settingsList;

    @action
    setSettings(response) {
        this._settingsList = response;
    }

    get userSettings(){
        return this._settingsList.slice();
    }
}

export const UserGeneralSettingStore = new Store();