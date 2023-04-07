import { observable, action, computed } from "mobx-angular";
import { Acl } from 'src/app/core/models/human-capital/users/user-setting';

class Store{
    @observable
    private _activityList: Acl[] = [];

   
    @observable
    loaded: boolean = false;


    
    @action
    setActivities(response: Acl[]) {
        this._activityList = response;
        this.loaded = true;
    }

    @computed
    get aclDetails(): Acl[] {
      
        return this._activityList.slice();
    }
}

export const UserAclStore = new Store();