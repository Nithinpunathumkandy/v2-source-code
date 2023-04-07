import { observable, action, computed } from "mobx-angular";
import { AmAnnualPlanStatus, AmAnnualPlanStatusPaginationResponse } from "src/app/core/models/masters/audit-management/am-annual-plan-status";

class Store {
    @observable
    private _amAnnualPlanStatus: AmAnnualPlanStatus[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'am_annual_plan_statuses.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setAmAnnualPlanStatus(response: AmAnnualPlanStatusPaginationResponse) {        
        this._amAnnualPlanStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllAmAnnualPlanStatus(AmAnnualPlanStatus: AmAnnualPlanStatus[]) {
        this._amAnnualPlanStatus = AmAnnualPlanStatus;
        this.loaded = true;
    }

    @action
    updateAmAnnualPlanStatus(type: AmAnnualPlanStatus) {
        const types: AmAnnualPlanStatus[] = this._amAnnualPlanStatus.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._amAnnualPlanStatus = types;
        }
    }

    @action
    getAmAnnualPlanStatusById(id: number): AmAnnualPlanStatus {
        return this._amAnnualPlanStatus.slice().find(e => e.id == id);
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
    get allItems(): AmAnnualPlanStatus[] {
        return this._amAnnualPlanStatus.slice();
    }

}

export const AmAnnualPlanStatusMasterStore = new Store();