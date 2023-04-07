import { observable, action, computed } from "mobx-angular";
import { Settings } from 'src/app/core/models/human-capital/users/user-setting';

class Store {

    @observable
    private _settingsList: Settings[] = [];


    @observable
    loaded: boolean = false;


    @action
    setSettings(response: Settings[]) {


        this._settingsList = response;
        this.loaded = true;
    }


    get userSettings(): Settings[] {

        return this._settingsList.slice();
    }

}

export const UserSettingStore = new Store();