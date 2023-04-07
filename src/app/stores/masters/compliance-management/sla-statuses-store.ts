import { observable, action, computed } from "mobx-angular";
import { SlaStatuses, SlaStatusesPaginationResponse } from "src/app/core/models/masters/compliance-management/sla-statuses";

class Store {
    @observable
    private _slaStatuses: SlaStatuses[] = [];

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
    orderItem: string = 'sla_status_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setSlaStatus(response: SlaStatusesPaginationResponse) {

        this._slaStatuses = response.data;
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

    @computed
    get slaStatuses(): SlaStatuses[] {

        return this._slaStatuses.slice();
    }
    @computed
    get allItems(): SlaStatuses[] {

        return this._slaStatuses.slice();
    }

    @action
    getSlaStatusesById(id: number): SlaStatuses {
        return this._slaStatuses.slice().find(e => e.id == id);
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

export const SlaStatusesMasterStore = new Store();