import { action, computed, observable } from "mobx-angular";
import { MsAditFindingStatuses, MsAditFindingStatusesPaginationResponse } from "src/app/core/models/masters/ms-audit-management/ms-audit-finding-status";

class Store{
    @observable
    private _msAditFindingStatuses : MsAditFindingStatuses[] = [];

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
    orderItem: string = 'ms_audit_finding_statuses.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    setAditFindingStatus(response: MsAditFindingStatusesPaginationResponse) {

        this._msAditFindingStatuses = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }
    
    @action
    unsetAditFindingStatus() {
        this._msAditFindingStatuses = [];
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
    get AditFindingStatus(): MsAditFindingStatuses[] {

        return this._msAditFindingStatuses.slice();
    }

    @computed
    get allItems(): MsAditFindingStatuses[] {        
        return this._msAditFindingStatuses.slice();
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
export const MsAditFindingStatusMasterStore = new Store();