import { action, computed, observable } from 'mobx';
import { MockDrillReport, MockDrillReportPaginationResponse } from 'src/app/core/models/mock-drill/mock-drill-report/mock-drill-report';


class Store {
    @observable
    private _mockDrillReport: MockDrillReport[] = [];


    @observable
    loaded: boolean = false;

    @observable
    individual_mockDrillReport_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    orderItem: string = 'mock_drill_report.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    searchText: string;

    @observable
    mock_drill_id: number = null;

    @observable
    lastCreatedMockDrillId: number = null;

    @computed
    get allItems(): MockDrillReport[] {
        return this._mockDrillReport.slice();
    }
    @computed
    get mockDrillList(): MockDrillReport[] {
        return this._mockDrillReport;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setMockDrill(response: MockDrillReportPaginationResponse) {
        this._mockDrillReport = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }
    @action
    unsetMockDrill() {
        this._mockDrillReport = [];
        this.loaded = false;
    }
}

export const MockDrillReportStore = new Store();