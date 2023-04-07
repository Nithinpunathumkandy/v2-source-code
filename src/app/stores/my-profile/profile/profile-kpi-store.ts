import { action, computed, observable } from 'mobx';
import { ProfileKPI, ProfileKPIPaginationResponse } from 'src/app/core/models/my-profile/profile/profile-kpi';

class Store{
    @observable
    private _profileKPI:ProfileKPI[] = [];

    @observable
    private _profileIndividualKPI:ProfileKPI;

    @observable
    loaded: boolean = false;

    @observable
    individual_kpi_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @computed
    get profileKpi(): ProfileKPI[] {
    //    return this._profileKPI.slice();
    return this._profileKPI;
    }

    @computed
    get profileIndividualKpi(): ProfileKPI {
    //    return this._profileKPI.slice();
    return this._profileIndividualKPI;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setProfileKPI(response: ProfileKPIPaginationResponse){
        this._profileKPI = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setIndividualProfileKpi(details) {
        this.individual_kpi_loaded = true;
        this._profileIndividualKPI=details;
    }

    unsetIndividualProfileKpi(){
        this.individual_kpi_loaded = false;
        this._profileIndividualKPI = null;
    }
    
}

export const ProfileKPIStore = new Store();