import { action, observable } from "mobx";
import { RiskManagementSettings } from "src/app/core/models/settings/risk-management-settings.model";

class Store {
    @observable
    private _riskManagementSettingsItems: RiskManagementSettings;

    @observable
    loaded: boolean = false;

    @action
    setRiskManagementSettings(settings: RiskManagementSettings) {
        this._riskManagementSettingsItems = settings;
        this.loaded = true;
    }

    get riskManagementSettings(): RiskManagementSettings { 
        return this._riskManagementSettingsItems; 
    }
}
export const RiskManagementSettingStore = new Store();