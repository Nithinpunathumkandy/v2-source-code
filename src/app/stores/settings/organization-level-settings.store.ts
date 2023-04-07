import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { OrganizationLevels } from 'src/app/core/models/settings/organization-settings';

class Store {
    @observable
    private _organizationLevelSettings: OrganizationLevels;

    @observable
    loaded: boolean = false;

    @action
    setOrganizationLevelSettings(settings: OrganizationLevels) {
        this._organizationLevelSettings = settings;
        this.loaded = true;
    }

    @computed
    get organizationLevelSettings(): OrganizationLevels {
        // console.log(this._organizationLevelSettings);
        return this._organizationLevelSettings;
    }

    
}

export const OrganizationLevelSettingsStore = new Store();