import { observable, action, computed } from "mobx-angular";
import { Integration } from 'src/app/core/models/human-capital/users/user-setting';

class Store{
    @observable
    private _integrationList: Integration[] = [];

   
    @observable
    loaded: boolean = false;


    
    @action
    setIntegration(response: Integration[]) {
        this._integrationList = response;
        this.loaded = true;
    }

    @computed
    get integrationDetails(): Integration[] {
      
        return this._integrationList.slice();
    }
}

export const UserIntegrationStore = new Store();