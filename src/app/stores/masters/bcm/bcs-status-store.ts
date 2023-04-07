import { observable, action, computed } from "mobx-angular";
import { BcsStatus, BcsStatusPaginationResponse } from "src/app/core/models/masters/bcm/bcs-status";

class Store {
    @observable
    private _bcsStatus: BcsStatus[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'business_continuity_strategy_status_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setBcsStatus(response: BcsStatusPaginationResponse) {        
        this._bcsStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllBcsStatus(BcsStatus: BcsStatus[]) {
        this._bcsStatus = BcsStatus;
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
    get allItems(): BcsStatus[] {
        return this._bcsStatus.slice();
    }

}

export const BcsStatusMasterStore = new Store();