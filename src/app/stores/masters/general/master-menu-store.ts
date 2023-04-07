import { observable, action, computed } from "mobx-angular";
import { Module } from "src/app/core/models/human-capital/users/user-setting";
import { OrganizationModuleGroup } from "src/app/core/models/settings/organization-modules";

class Store {

    @observable
    private _masterMenu: OrganizationModuleGroup[] = [];

    @observable 
    loaded:boolean=false;

    @action
    setMasterMenu(response: OrganizationModuleGroup[]) {
        this._masterMenu = response;
        this.loaded = true;
    }

    get masterMenu():OrganizationModuleGroup[]{
        return this._masterMenu.slice();
    }

}

export const MasterMenuItemsStore = new Store();