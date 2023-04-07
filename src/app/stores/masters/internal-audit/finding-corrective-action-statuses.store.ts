import { observable, action, computed } from "mobx-angular";
import { FindingCorrectiveActionStatuses, FindingCorrectiveActionStatusesPaginationResponse } from "src/app/core/models/masters/internal-audit/finding-corrective-action-statuses";

class Store {
    @observable
    private _findingCorrectiveActionStatuses: FindingCorrectiveActionStatuses[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'finding_corrective_action_status_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setFindingCorrectiveActionStatuses(response: FindingCorrectiveActionStatusesPaginationResponse) {        
        this._findingCorrectiveActionStatuses = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllFindingCorrectiveActionStatuses(FindingCorrectiveActionStatuses: FindingCorrectiveActionStatuses[]) {
        this._findingCorrectiveActionStatuses = FindingCorrectiveActionStatuses;
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
    get allItems(): FindingCorrectiveActionStatuses[] {
        return this._findingCorrectiveActionStatuses.slice();
    }

}

export const FindingCorrectiveActionStatusesMasterStore = new Store();