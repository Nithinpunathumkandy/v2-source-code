import { observable, action, computed } from "mobx-angular";
import { StrategyStatus, StrategyStatusPaginationResponse } from "src/app/core/models/masters/strategy/strategy-status";


class Store {
    @observable
    private _strategyStatus: StrategyStatus[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'strateg_status.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setStrategyStatus(response: StrategyStatusPaginationResponse) {
        
        this._strategyStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllStrategyStatus(status: StrategyStatus[]) {
       
        this._strategyStatus = status;
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
    get allItems(): StrategyStatus[] {
        return this._strategyStatus.slice();
    }

}

export const StrategyStatusMasterStore = new Store();