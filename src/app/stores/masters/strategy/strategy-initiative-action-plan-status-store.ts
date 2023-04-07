import { observable, action, computed } from "mobx-angular";
import { StrategyInitiativeActionPlanStatus, StrategyInitiativeActionPlanStatusPaginationResponse } from "src/app/core/models/masters/Strategy/strategy-initiative-action-plan-status";


class Store {
    @observable
    private _strategyInitiativeActionPlanStatus: StrategyInitiativeActionPlanStatus[] = [];

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
    orderItem: string = 'strategy_initiative_action_plan_status.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setStrategyInitiativeActionPlanStatus(response: StrategyInitiativeActionPlanStatusPaginationResponse) {
        
        this._strategyInitiativeActionPlanStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllStrategyInitiativeActionPlanStatus(status: StrategyInitiativeActionPlanStatus[]) {
       
        this._strategyInitiativeActionPlanStatus = status;
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
    get allItems(): StrategyInitiativeActionPlanStatus[] {
        return this._strategyInitiativeActionPlanStatus.slice();
    }

}

export const StrategyInitiativeActionPlanStatusMasterStore = new Store();