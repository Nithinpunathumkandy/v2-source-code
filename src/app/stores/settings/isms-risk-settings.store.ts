import { action, observable } from "mobx";
import { ISMSRiskSettings } from "src/app/core/models/settings/isms-risk-settings.model";

class Store {
    @observable
    private _ismsRiskSettingsItems: ISMSRiskSettings;

    @observable
    loaded: boolean = false;

    @action
    setISMSRiskSettings(settings: ISMSRiskSettings) {
        this._ismsRiskSettingsItems = settings;
        this.loaded = true;
    }

    get ismsRiskSettings(): ISMSRiskSettings { 
        return this._ismsRiskSettingsItems; 
    }
}
export const ISMSRiskSettingStore = new Store();