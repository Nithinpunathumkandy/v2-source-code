import { action, computed, observable } from "mobx-angular";
import { MsAditPlanStatuses, MsAditPlanStatusesPaginationResponse } from "src/app/core/models/masters/ms-audit-management/ms-audit-plan-status";

class Store{
    @observable
    private _msAditPlanStatuses : MsAditPlanStatuses[] = [];

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
    orderItem: string = 'ms_audit_plan_statuses.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    setAditPlanStatus(response: MsAditPlanStatusesPaginationResponse) {

        this._msAditPlanStatuses = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }
    
    @action
    unsetAditPlanStatus() {
        this._msAditPlanStatuses = [];
        this.loaded = false;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @computed
    get msAditPlanStatus(): MsAditPlanStatuses[] {

        return this._msAditPlanStatuses.slice();
    }

    // @action
    // getAditPlanStatusById(id: number): MsAditPlanStatuses {
    //     return this._msAditPlanStatuses.slice().find(e => e.id == id);
    // }

    @computed
    get allItems(): MsAditPlanStatuses[] {        
        return this._msAditPlanStatuses.slice();
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
export const MsAditPlanStatusMasterStore = new Store();