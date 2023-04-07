import { action, computed, observable } from "mobx";
import { MockDrillActionStatus, MockDrillActionStatusPaginationResponse, MockDrillActionStatusSingle } from "src/app/core/models/masters/mock-drill/mock-drill-action-status";

class Store {
    @observable
    private _MockDrillActionStatus: MockDrillActionStatus[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'mock_drill_status.created_at';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;

    @observable
    individualLoaded: boolean = false;

    @observable
    individualMockDrillActionStatus: MockDrillActionStatusSingle;

    searchText: string;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setMockDrillActionStatus(response: MockDrillActionStatusPaginationResponse) {
        this._MockDrillActionStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.from = response.from;
        this.loaded = true;
    }

    @computed
    get allItems(): MockDrillActionStatus[] {
        return this._MockDrillActionStatus.slice();
    }
}
export const MockDrillActionStatusMasterStore = new Store();