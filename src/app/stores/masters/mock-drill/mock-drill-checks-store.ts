import { action, computed, observable } from "mobx-angular";
import { MockDrillChecks, MockDrillChecksPaginationResponse, MockDrillChecksSingle } from "src/app/core/models/masters/mock-drill/mock-drill-checks";
// import { MockDrillSingle, MockDrillResponseService, MockDrillResponseServicePaginationResponse } from "src/app/core/models/masters/mock-drill/mock-drill-response-service";

class Store {
    @observable
    private _mockDrillChecks: MockDrillChecks[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'mock_drill_checks.created_at';

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
    response_service_check_id: number = null;

    // @observable
    individualMockDrillChecks: MockDrillChecksSingle;

    @observable
    individualLoaded: boolean = false;

    searchText: string;

    @action
    setMockDrillResponseService(response: MockDrillChecksPaginationResponse) {
        this._mockDrillChecks = response.data;
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
    setLastInserted(id: number) {
        this.lastInsertedId = id;
    }

    @action
    setindividualMockDrill(mockDrill: MockDrillChecksSingle) {
        this.individualMockDrillChecks = mockDrill;
        this.individualLoaded = true;
    }



    @action
    getMockDrillChecksById(id: number): MockDrillChecks {
        return this._mockDrillChecks.slice().find(e => e.id == id);
    }

    @computed
    get allItems(): MockDrillChecks[] {
        return this._mockDrillChecks.slice();
    }

}

export const MockDrillChecksMasterStore = new Store();