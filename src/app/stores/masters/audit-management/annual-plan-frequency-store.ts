import { observable, action, computed } from "mobx-angular";

import { AnnualPlanFrequency,AnnualPlanFrequencyPaginationResponse } from 'src/app/core/models/masters/audit-management/annual-plan-frequency';


class Store {
    @observable
    private _annualPlanFrequency: AnnualPlanFrequency[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'annual_plan_frequencies.created_at';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;
    
    searchText: string;
    
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setAnnualPlanFrequency(response: AnnualPlanFrequencyPaginationResponse) {
        this._annualPlanFrequency = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true; 
    }

    @action
    setAllAnnualPlanFrequency(type: AnnualPlanFrequency[]) {
        this._annualPlanFrequency = type;
        this.loaded = true;
    }

    @action
    unsetAllAnnualPlanFrequency() {
        this._annualPlanFrequency = [];
        this.loaded = false;
    }

    @computed
    get allItems(): AnnualPlanFrequency[] {        
        return this._annualPlanFrequency.slice();
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getAnnualPlanFrequencyById(id: number): AnnualPlanFrequency {
        return this._annualPlanFrequency.slice().find(e => e.id == id);
    }
  
}

export const AnnualPlanFrequencyMasterStore = new Store();

