import { observable, action, computed } from "mobx-angular";
import { UnsafeActionStatus, UnsafeActionStatusPaginationResponse } from "src/app/core/models/masters/jso/unsafe-action-status";

class Store {
    @observable
    private _unsafeActionStatus: UnsafeActionStatus[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'unsafe_action_status_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setUnsafeActionStatus(response: UnsafeActionStatusPaginationResponse) {    
        this._unsafeActionStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllUnsafeActionStatus(UnsafeActionStatus: UnsafeActionStatus[]) {
        this._unsafeActionStatus = UnsafeActionStatus;
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
    get allItems(): UnsafeActionStatus[] {
        return this._unsafeActionStatus.slice();
    }

}

export const UnsafeActionStatusMasterStore = new Store();