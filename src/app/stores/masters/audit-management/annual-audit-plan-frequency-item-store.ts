import { observable, action, computed } from "mobx-angular";
import { AnnualPlanFrequencyItem,AnnualPlanFrequencyItemPaginationResponse } from 'src/app/core/models/masters/audit-management/annual-audit-plan-frequency-item';


class Store {
    @observable
    private _annualPlanFrequencyItem: AnnualPlanFrequencyItem[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'annual_plan_frequencies_item.created_at';

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
    setAnnualPlanFrequencyItem(response: AnnualPlanFrequencyItemPaginationResponse) {
        this._annualPlanFrequencyItem = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true; 
    }

    @action
    setAllAnnualPlanFrequencyItem(type: AnnualPlanFrequencyItem[]) {
        this._annualPlanFrequencyItem = type;
        this.loaded = true;
    }

    @action
    unsetsetAllAnnualPlanFrequencyItem() {
        this._annualPlanFrequencyItem = [];
        this.loaded = false;
    }

    @computed
    get allItems(): AnnualPlanFrequencyItem[] {        
        return this._annualPlanFrequencyItem.slice();
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getAnnualPlanFrequencyItemById(id: number): AnnualPlanFrequencyItem {
        return this._annualPlanFrequencyItem.slice().find(e => e.id == id);
    }
  
}

export const AnnualPlanFrequencyItemMasterStore = new Store();