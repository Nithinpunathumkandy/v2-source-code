import { action, computed, observable } from 'mobx';
import { ProfileRR, ProfileRRPaginationResponse } from 'src/app/core/models/my-profile/profile/profile-r-r';

class Store{
    @observable
    private _profileRR:ProfileRR[] = [];

    @observable
    private _individualRoleDetails:ProfileRR;

    @observable
    loaded:boolean =false;

    @observable
    individual_RR_Loaded:boolean =true;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    user_id: number = null;

    @computed
    get individualRoleDetails(): ProfileRR{
        return this._individualRoleDetails;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    
    @computed
    get profileRR(): ProfileRR[] {
       return this._profileRR.slice();
    }

    @action
    setProfileRR(response: ProfileRRPaginationResponse){
        this._profileRR = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    
    @action
    setIndividualRoleDetails(details){
        this.individual_RR_Loaded=true;
        this._individualRoleDetails = details;
    }

    unsetIndiviudalRoleDetails(){
        this._individualRoleDetails = null;
        this.individual_RR_Loaded = false;
    }
}

export const ProfileRRStore = new Store();