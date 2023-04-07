import { observable, action, computed } from "mobx-angular";
import { FindingStatuses, FindingStatusesPaginationResponse } from "src/app/core/models/masters/internal-audit/finding-statuses";

class Store {
    @observable
    private _findingStatuses: FindingStatuses[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'finding_status_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setFindingStatuses(response: FindingStatusesPaginationResponse) {        
        this._findingStatuses = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllFindingStatuses(FindingStatuses: FindingStatuses[]) {
        this._findingStatuses = FindingStatuses;
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
    get allItems(): FindingStatuses[] {
        return this._findingStatuses.slice();
    }

}

export const FindingStatusesMasterStore = new Store();