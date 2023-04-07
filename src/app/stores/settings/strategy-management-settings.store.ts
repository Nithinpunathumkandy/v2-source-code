import { action, observable } from "mobx";
import { StrategyManagementSettings } from "src/app/core/models/settings/strategy-management-settings";

class Store {
    @observable
    private _strategyManagementSettingsItems: StrategyManagementSettings;

    @observable
    loaded: boolean = false;

    @action
    setStrategyManagementSettings(settings: StrategyManagementSettings) {
        this._strategyManagementSettingsItems = settings;
        this.loaded = true;
    }

    get strategyManagementSettings(): StrategyManagementSettings { 
        return this._strategyManagementSettingsItems; 
    }
}
export const StrategyManagementSettingStore = new Store();