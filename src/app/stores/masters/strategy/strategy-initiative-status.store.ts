import { observable, action, computed } from "mobx-angular";
import { StrategyInitiativeStatus, StrategyInitiativeStatusPaginationResponse } from "src/app/core/models/masters/Strategy/strategy-initiative-status";


class Store {
    @observable
    private _strategyInitiativeStatus: StrategyInitiativeStatus[] = [];

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
    orderItem: string = 'strategy_initiative_status.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setStrategyInitiativeStatus(response: StrategyInitiativeStatusPaginationResponse) {
        
        this._strategyInitiativeStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllStrategyInitiativeStatus(status: StrategyInitiativeStatus[]) {
       
        this._strategyInitiativeStatus = status;
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
    get allItems(): StrategyInitiativeStatus[] {
        return this._strategyInitiativeStatus.slice();
    }

}

export const StrategyInitiativeStatusMasterStore = new Store();