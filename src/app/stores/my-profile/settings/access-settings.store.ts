import { observable, action, computed } from "mobx-angular";
import { AccessSettings } from 'src/app/core/models/my-profile/settings/access-settings';

class Store{

    @observable
    private _accessBranchList: AccessSettings[] = [];

    @observable
    private _accessOrganizationList: AccessSettings[] = [];

    @observable
    private _accessMsTypeList: AccessSettings[] = [];

    @observable
    loaded: boolean = false;

    @action
    setAccesses(response: AccessSettings[], type) {
  
        if (type == 'branches'){
            this._accessBranchList = response;
        }
        else if (type == 'organization-structures'){
            this._accessOrganizationList = response;
        }
        else if (type == 'ms-types')
            this._accessMsTypeList = response;
        this.loaded = true;
    }

    get accessBranchDetails(): AccessSettings[] {

        return this._accessBranchList.slice();
    }

    get accessOrganizationDetails(): AccessSettings[] {

        return this._accessOrganizationList.slice();
    }

    get accessMsTypeDetails(): AccessSettings[] {
        return this._accessMsTypeList.slice();
    }
}

export const AccessSettingStore = new Store();