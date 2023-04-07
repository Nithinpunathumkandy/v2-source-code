import { observable, action, computed } from "mobx-angular";
import { BcsFinance, BcsFinancePaginationResponse } from "src/app/core/models/masters/bcm/bcs-finances";

class Store {
    @observable
    private _bcsFinance: BcsFinance[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'business_continuity_strategy_finances_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setBcsFinance(response: BcsFinancePaginationResponse) {        
        this._bcsFinance = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllBcsFinance(bcsFinance: BcsFinance[]) {
        this._bcsFinance = bcsFinance;
        this.loaded = true;
    }

    @action
    setCurrentPage(currentPage: number) {
        this.currentPage = currentPage;
    }

    @action
    setOrderBy(orderBy: 'asc' | 'desc') {
        this.orderBy = orderBy;
    }

    @computed
    get allItems(): BcsFinance[] {
        return this._bcsFinance.slice();
    }

}

export const BcsFinanceMasterStore = new Store();