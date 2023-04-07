
import { observable, action, computed } from "mobx-angular";
import { StrategyPerformances, StrategyPerformancesPaginationResponse } from "src/app/core/models/masters/strategy/strategy-performance.model";

class Store {
    
    @observable
    private _strategyPerformances: StrategyPerformances[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'strategy_performances.title';

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
    setstrategyPerformances(response: StrategyPerformancesPaginationResponse) {
        
        this._strategyPerformances = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setAllstrategyPerformances(performances: StrategyPerformances[]) {
        this._strategyPerformances = performances;
        this.loaded = true; 
    }
    
    @computed
    get allItems(): StrategyPerformances[] {
        return this._strategyPerformances.slice();
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getstrategyPerformancesById(id: number): StrategyPerformances {
        return this._strategyPerformances.slice().find(e => e.id == id);
    }
    
    @action
    unsetAllstrategyPerformances() {
        this._strategyPerformances = [];
        this.loaded = false;
    }
}
export const StrategyPerformancesMasterStore = new Store();