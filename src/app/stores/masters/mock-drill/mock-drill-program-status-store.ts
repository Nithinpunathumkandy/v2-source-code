import { action, computed, observable } from "mobx";
import { MockDrillProgramStatus, MockDrillProgramStatusPaginationResponse, MockDrillProgramStatusSingle } from "src/app/core/models/masters/mock-drill/mock-drill-program-status";

class Store {
    @observable
    private _mockDrillProgramStatus: MockDrillProgramStatus[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'mock_drill_program_status.created_at';

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
    individualMockDrillProgramStatus: MockDrillProgramStatusSingle;

    searchText: string;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setMockDrillProgramStatus(response: MockDrillProgramStatusPaginationResponse) {
        this._mockDrillProgramStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.from = response.from;
        this.loaded = true;
    }
    @computed
    get allItems(): MockDrillProgramStatus[] {
        return this._mockDrillProgramStatus.slice();
    }
}
export const MockDrillProgramStatusMasterStore = new Store();