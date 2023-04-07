import { observable, action, computed } from "mobx-angular";
import { BusinessContinuityStrategySolutionStatus, BusinessContinuityStrategySolutionStatusPaginationResponse } from "src/app/core/models/masters/bcm/business-continuity-strategy-solution-status";


class Store {
    @observable
    private _businessContinuityStrategySolutionStatus: BusinessContinuityStrategySolutionStatus[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'business_continuity_strategy_solution_status_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setBusinessContinuityStrategySolutionStatus(response: BusinessContinuityStrategySolutionStatusPaginationResponse) {        
        this._businessContinuityStrategySolutionStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllBusinessContinuityStrategySolutionStatus(BcsStatus: BusinessContinuityStrategySolutionStatus[]) {
        this._businessContinuityStrategySolutionStatus = BcsStatus;
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
    get allItems(): BusinessContinuityStrategySolutionStatus[] {
        return this._businessContinuityStrategySolutionStatus.slice();
    }

}

export const BusinessContinuityStrategySolutionStatusMasterStore = new Store();