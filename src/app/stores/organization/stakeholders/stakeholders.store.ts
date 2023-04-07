import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { Stakeholder, StakeholderPaginationResponse, StakeholderDetails } from 'src/app/core/models/organization/stakeholder/stakeholder';

class Store {
    @observable
    private _stakeholders: Stakeholder[] = [];

    @observable
    loaded: boolean = false;

    @observable
    stakeholderDetailsLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'stakeholders.id';

    @observable
    from: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedId: number = null;

    @observable
    private _stakeholderDetails: any;

    searchText: string;

    @action
    setStakeholders(response: StakeholderPaginationResponse) {
        this._stakeholders = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setAllStakeholders(stakeholders: Stakeholder[]) {
        this.loaded = true;
        this._stakeholders = stakeholders;
    }

    @action
    setSelectedStakeholderDetails(stakeholderDetails: StakeholderDetails){
        this._stakeholderDetails = stakeholderDetails;
        this.stakeholderDetailsLoaded = true;
    }

    
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    updateStakeholder(stakeholder: Stakeholder) {
        const stakeholders: Stakeholder[] = this._stakeholders.slice();
        const index: number = stakeholders.findIndex(e => e.id == stakeholder.id);
        if (index != -1) {
            stakeholders[index] = stakeholder;
            this._stakeholders=stakeholders;
        }
    }

    @computed
    get stakeholders(): Stakeholder[] {
        
        return this._stakeholders.slice();
    }

    @computed
    get stakeholderDetails():StakeholderDetails{
        return this._stakeholderDetails;
    }

    @action
    getStakeholderById(id: number): Stakeholder {
        return this._stakeholders.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    unsetStakeholders(){
        this._stakeholders = [];
        this.currentPage = 1;
        this.loaded = false;
    }

    unsetStakeholderDetails(){
        this.stakeholderDetailsLoaded = false;
        this._stakeholderDetails = null;
    }
    
}

export const StakeholdersStore = new Store();