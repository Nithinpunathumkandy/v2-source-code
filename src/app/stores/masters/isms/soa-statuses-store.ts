import { observable, action, computed } from "mobx-angular";
import { SoaStatus, SoaStatusPaginationResponse } from "src/app/core/models/masters/isms/soa_statuses";

class Store {
    @observable
    private _soaStatuses: SoaStatus[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'soa_statuses.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setSoaStatus(response: SoaStatusPaginationResponse) {        
        this._soaStatuses = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllSoaStatus(SoaStatus: SoaStatus[]) {
        this._soaStatuses = SoaStatus;
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
    get allItems(): SoaStatus[] {
        return this._soaStatuses.slice();
    }

}

export const SoaStatusMasterStore = new Store();