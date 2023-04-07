import { observable, action } from 'mobx-angular';
import { computed } from 'mobx';
import { OrganizationModuleGroup } from 'src/app/core/models/settings/organization-modules';

class Store {
    @observable
    sideMenu: OrganizationModuleGroup[] = [];

    @action
    setSideMenuItems(sideMenuItems: OrganizationModuleGroup[]) {
        this.sideMenu = sideMenuItems
    }

    @computed
    get sideMenuItems():OrganizationModuleGroup[]{
        return this.sideMenu.slice();
    }
}

export const SideMenuStore = new Store();