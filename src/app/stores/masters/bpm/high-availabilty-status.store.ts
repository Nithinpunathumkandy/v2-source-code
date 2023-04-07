import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { HighAvailabilityStatus, HighAvailabilityStatusPaginationResponse } from "src/app/core/models/masters/bpm/high-availabilty-status";

class Store {
    @observable
    private _HighAvailabilityStatus: HighAvailabilityStatus[] = [];

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
    orderItem: string = 'high_availability_statuses.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setHighAvailabilityStatus(response: HighAvailabilityStatusPaginationResponse) {

        this._HighAvailabilityStatus = response.data;
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
    updateHighAvailabilityStatus(type: HighAvailabilityStatus) {
        const types: HighAvailabilityStatus[] = this._HighAvailabilityStatus.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._HighAvailabilityStatus = types;
        }
    }

    @computed
    get HighAvailabilityStatus(): HighAvailabilityStatus[] {

        return this._HighAvailabilityStatus.slice();
    }
    @computed
    get allItems(): HighAvailabilityStatus[] {

        return this._HighAvailabilityStatus.slice();
    }

    @action
    getHighAvailabilityStatusById(id: number): HighAvailabilityStatus {
        return this._HighAvailabilityStatus.slice().find(e => e.id == id);
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

export const HighAvailabilityStatusMasterStore = new Store();