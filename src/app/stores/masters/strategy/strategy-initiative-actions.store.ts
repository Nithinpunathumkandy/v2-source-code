import { observable, action, computed } from "mobx-angular";
import { StrategyInitiativeActions, StrategyInitiativeActionsPaginationResponse } from "src/app/core/models/masters/strategy/strategy-initiative-actions";
import { StrategyInitiativeReviewFrequency, StrategyInitiativeReviewFrequencyPaginationResponse } from "src/app/core/models/masters/strategy/strategy-initiative-review-frequencies";

class Store {
    @observable
    private _strategyInitiativeActions: StrategyInitiativeActions[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'strategy_initiative_actions.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;
    
    searchText: string;

    @action
    setStrategyInitiativeActions(response: StrategyInitiativeActionsPaginationResponse) {        
        this._strategyInitiativeActions = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllStrategyInitiativeActions(strategyInitiativeActions: StrategyInitiativeActions[]) {
        this._strategyInitiativeActions = strategyInitiativeActions;
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

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @computed
    get allItems(): StrategyInitiativeActions[] {
        return this._strategyInitiativeActions.slice();
    }

    @action
    getStrategyInitiativeActionsById(id: number): StrategyInitiativeActions {
        return this._strategyInitiativeActions.slice().find(e => e.id == id);
    }
}

export const StrategyInitiativeActionsMasterStore = new Store();