import { observable, action, computed } from "mobx-angular";
import { Impact, ImpactPaginationResponse, IndividualImpact } from 'src/app/core/models/risk-management/risk-configuration/impact';
class Store {
    @observable
    private _impactList: Impact[] = [];

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'reference_code';

    @observable
    private _individualImpactDetails: IndividualImpact;

    @observable
    individual_impact_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    selected: number = null;

    @observable
    searchText: string;

    @action
    setImpactDetails(response: ImpactPaginationResponse) {
        this._impactList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    updateImpact(impact: Impact) {
        const impacts: Impact[] = this._impactList.slice();
        const index: number = impacts.findIndex(e => e.id == impact.id);
    }


    @computed
    get impactDetails(): Impact[] {

        return this._impactList.slice();
    }

    getImpactById(id: number): IndividualImpact {
        let impactList;

        impactList = this._impactList.slice().find(e => e.id == id);
        IsmsImpactStore.setIndividualImpactDetails(impactList);
        return impactList;
    }

    @action
    setIndividualImpactDetails(details:IndividualImpact) {
        this.individual_impact_loaded = true;
        this._individualImpactDetails = details;
        // this.updateImpact(details);
    }

    unsetIndiviudalImpactDetails() {
        this._individualImpactDetails = null;
        this.individual_impact_loaded = false;
    }

   
    @computed
    get individualImpactDetails(): IndividualImpact {
        return this._individualImpactDetails;
    }


}

export const IsmsImpactStore = new Store();