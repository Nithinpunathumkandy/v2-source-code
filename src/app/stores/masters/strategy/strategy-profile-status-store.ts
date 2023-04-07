import { observable, action, computed } from "mobx-angular";
import { StrategyProfileStatus, StrategyProfileStatusPaginationResponse } from "src/app/core/models/masters/Strategy/strategy-profile-status";


class Store {
    @observable
    private _strategyProfileStatus: StrategyProfileStatus[] = [];

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
    orderItem: string = 'strategy_profile_status.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setStrategyProfileStatus(response: StrategyProfileStatusPaginationResponse) {
        
        this._strategyProfileStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllStrategyProfileStatus(status: StrategyProfileStatus[]) {
       
        this._strategyProfileStatus = status;
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
    get allItems(): StrategyProfileStatus[] {
        return this._strategyProfileStatus.slice();
    }

}

export const StrategyProfileStatusMasterStore = new Store();