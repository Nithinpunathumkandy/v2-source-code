import { action, computed, observable } from "mobx";
import { MockDrillStatus, MockDrillStatusPaginationResponse, MockDrillStatusSingle } from "src/app/core/models/masters/mock-drill/mock-drill-status";

class Store {
    @observable
    private _mockDrillStatus: MockDrillStatus[] = [];

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
    individualMockDrillStatus: MockDrillStatusSingle;

    searchText: string;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setMockDrillStatus(response: MockDrillStatusPaginationResponse) {
        this._mockDrillStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.from = response.from;
        this.loaded = true;
    }
    // @action
    // setIndividualMockDrillStatus(mockDrillStatus: MockDrillStatusSingle) {
    //     this.individualMockDrillStatus = mockDrillStatus;
    //     this.individualLoaded = true;
    // }


    @computed
    get allItems(): MockDrillStatus[] {
        return this._mockDrillStatus.slice();
    }
}
export const MockDrillStatusMasterStore = new Store();