import { observable, action, computed } from "mobx-angular";
import { OrganizationGeneralSettings } from 'src/app/core/models/settings/organization-general-settings';

class Store {
    @observable
    private _organizationGeneralSettings: OrganizationGeneralSettings;

    @observable
    loaded: boolean = false;

    @action
    setOrganizationSettings(settings: OrganizationGeneralSettings) {
        this.loaded = true;
        this._organizationGeneralSettings = settings;
    }

    @computed
    get organizationSettings(): OrganizationGeneralSettings {
        return this._organizationGeneralSettings;
    }

    
}

export const OrganizationGeneralSettingsStore = new Store();