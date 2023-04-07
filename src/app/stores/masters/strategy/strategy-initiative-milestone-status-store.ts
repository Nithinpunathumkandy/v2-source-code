import { observable, action, computed } from "mobx-angular";
import { StrategyInitiativeMilestoneStatus, StrategyInitiativeMilestoneStatusPaginationResponse } from "src/app/core/models/masters/strategy/strategy-initiative-milestone-status";

class Store {
    @observable
    private _strategyInitiativeMilestoneStatus: StrategyInitiativeMilestoneStatus[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    lastInsertedId: number = null;

    @observable
    orderItem: string = 'strategy_initiative_milestone_status.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    strategyInitiativeMilestoneStatusDetails: any;

    searchText: string;

    @action
    setStrategyInitiativeMilestoneStatus(response: StrategyInitiativeMilestoneStatusPaginationResponse) {

        this._strategyInitiativeMilestoneStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
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
    updateStrategyInitiativeMilestoneStatus(type: StrategyInitiativeMilestoneStatus) {
        // const Location: StrategyInitiativeMilestoneStatus[] = this._strategyInitiativeMilestoneStatus.slice();
        // const index: number = Location.findIndex(e => e.id == type.id);
        // if (index != -1) {
        //     Location[index] = type;
        //     this._strategyInitiativeMilestoneStatus = Location;
        // }
        this.strategyInitiativeMilestoneStatusDetails=type
    }

    @computed
    get StrategyInitiativeMilestoneStatus(): StrategyInitiativeMilestoneStatus[] {

        return this._strategyInitiativeMilestoneStatus.slice();
    }
    @computed
    get allItems(): StrategyInitiativeMilestoneStatus[] {

        return this._strategyInitiativeMilestoneStatus.slice();
    }

    @action
    getStrategyInitiativeMilestoneStatusById(id: number): StrategyInitiativeMilestoneStatus {
        return this._strategyInitiativeMilestoneStatus.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedId(id: number) {
        this.lastInsertedId = id;
    }

    get LastInsertedId(): number {
        if (this.lastInsertedId)
            return this.lastInsertedId;
        else
            return null;
    }

}

export const StrategyInitiativeMilestoneStatusMasterStore = new Store();