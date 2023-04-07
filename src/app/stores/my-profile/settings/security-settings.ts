import { observable, action, computed } from "mobx-angular";

class Store {

    @observable
    private _verificationStatus = null;

    @observable
    loaded: boolean = false;

    @action
    setVerificationStatus(response) {
        this._verificationStatus = response[0].status;
        this.loaded = true;
    }
  
    @action
    setVerificationStatusByEdit(response) {
        this._verificationStatus = response;
        this.loaded = true;
    }

    get verificationStatus(){
        return this._verificationStatus;
    }

}

export const ProfileSecuritySettingStore = new Store();