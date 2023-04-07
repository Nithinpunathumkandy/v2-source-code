import { action, observable } from "mobx";
import { AssetManagementSettings } from "src/app/core/models/settings/asset-settings";


class Store {
    @observable
    private _assetManagementSettingsItems: AssetManagementSettings;

    @observable
    loaded: boolean = false;

    @action
    setAssetManagementSettings(settings: AssetManagementSettings) {
        this._assetManagementSettingsItems = settings;
        this.loaded = true;
    }

    get assetManagementSettings(): AssetManagementSettings { 
        return this._assetManagementSettingsItems; 
    }
}
export const AssetManagementSettingStore = new Store();