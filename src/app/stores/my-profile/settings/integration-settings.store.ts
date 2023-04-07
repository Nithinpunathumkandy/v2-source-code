import { observable, action, computed } from "mobx-angular";
import { IntegrationSettings } from 'src/app/core/models/my-profile/settings/integration-settings';


class Store{
    @observable
    private _integrationList: IntegrationSettings[] = [];

   
    @observable
    loaded: boolean = false;


    
    @action
    setIntegration(response: IntegrationSettings[]) {
        this._integrationList = response;
        this.loaded = true;
    }

    @action
    unsetIntegration() {
        this._integrationList = [];
        this.loaded = false;
    }

    @computed
    get integrationDetails(): IntegrationSettings[] {
      
        return this._integrationList.slice();
    }
}

export const IntegrationSettingStore = new Store();