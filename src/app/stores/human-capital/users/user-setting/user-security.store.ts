import { observable, action, computed } from "mobx-angular";
import { Settings } from 'src/app/core/models/human-capital/users/user-setting';

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



    get verificationStatus(){

        return this._verificationStatus;
    }

}

export const UserSecurityStore = new Store();