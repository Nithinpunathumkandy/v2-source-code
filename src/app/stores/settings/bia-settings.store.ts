import { action, observable } from "mobx";
import { BiaSettings } from "src/app/core/models/settings/bia-settings";

class Store {
    @observable
    private _BiaSettingsItems: BiaSettings;

    @observable
    loaded: boolean = false;

    @action
    setBiaSettings(settings: BiaSettings) {
        this._BiaSettingsItems = settings;
        this.loaded = true;
    }

    get BiaSettingsItems(): BiaSettings { 
        return this._BiaSettingsItems; 
    }
}
export const BiaSettingStore = new Store();