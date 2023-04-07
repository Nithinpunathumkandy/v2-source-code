import { observable, action, computed } from "mobx-angular";
import { individualActiveDirectorySetting } from "src/app/core/models/settings/active-directory-setting";

class Store {

    @observable
    private _individualActiveDirectorySetting: individualActiveDirectorySetting;

    @observable
    individualLoaded: boolean = false;

    @action
    setIndividualActiveDirectorySetting(indivitual: individualActiveDirectorySetting) {       
    this._individualActiveDirectorySetting = indivitual;
    this.individualLoaded = true;
    }


    @computed
    get indivitualActiveDirectorySetting(){
        return this._individualActiveDirectorySetting
    }

    @action
    unsetIndividualActiveDirectorySettingData() {
        this._individualActiveDirectorySetting = null as any;
        this.individualLoaded = false;
    }
}

export const ActiveDirectorySettingStore = new Store();