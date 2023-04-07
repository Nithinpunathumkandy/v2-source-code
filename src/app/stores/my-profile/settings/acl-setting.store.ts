import { observable, action, computed } from "mobx-angular";
import { AclSettings } from 'src/app/core/models/my-profile/settings/acl-settings';

class Store{
    @observable
    private _activityList: AclSettings[] = [];
 
    @observable
    loaded: boolean = false;

    @action
    setActivities(response: AclSettings[]) {
        this._activityList = response;
        this.loaded = true;
    }

    @computed
    get aclDetails(): AclSettings[] {  
        return this._activityList.slice();
    }
}

export const AclSettingStore = new Store();