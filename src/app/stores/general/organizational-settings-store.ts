import { observable, action, computed } from "mobx-angular";

class Store {
    
    @observable
    isMultiple : boolean = true

    @observable
    showBranch: boolean = false;
}
export const OrganizationalSettingsStore = new Store();