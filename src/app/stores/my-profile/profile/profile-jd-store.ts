import { action, computed, observable } from 'mobx';
import { ProfileJD, ProfileJDDetails, ProfileJDPaginationResponse } from 'src/app/core/models/my-profile/profile/profile-jd';

class Store{
    @observable
    private _profileJD:ProfileJD[] = [];

    @observable
    private _profileJDDetails:ProfileJDDetails;

    @observable
    loaded:boolean =false;

    @observable
    profilejd_details_loaded:boolean =true;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @computed
    get profileJD(): ProfileJD[] {
       return this._profileJD;
    }

    @computed
    get profileJDDetails(): ProfileJDDetails {
       return this._profileJDDetails;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setProfileJD(response: ProfileJDPaginationResponse){
        this._profileJD = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setProfileJDDetails(details:ProfileJDDetails) {
        this.profilejd_details_loaded = true
        this._profileJDDetails=details;
    }

    unsetProfileJDDetails(){
        this.profilejd_details_loaded = false;
        this._profileJDDetails = null;
    }
}

export const ProfileJDStore = new Store();