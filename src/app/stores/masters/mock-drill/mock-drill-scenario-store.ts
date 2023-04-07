import { action, computed, observable } from "mobx-angular";
import { MockDrillScenarioSingle, MockDrillScenario, MockDrillScenarioPaginationResponse } from "src/app/core/models/masters/mock-drill/mock-drill-scenario";

class Store {
    @observable
    private _mockDrillScenario: MockDrillScenario[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'mock_drill_scenarios.created_at';

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
    individualMockDrill: MockDrillScenarioSingle;

    @observable
    individualLoaded: boolean = false;

    searchText: string;

    @action
    setMockDrillScenario(response: MockDrillScenarioPaginationResponse) {
        this._mockDrillScenario = response.data;
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
    setindividualMockDrillScenario(mockDrill: MockDrillScenarioSingle) {
        this.individualMockDrill = mockDrill;
        this.individualLoaded = true;
    }



    @action
    getScenarioById(id: number): MockDrillScenario {
        return this._mockDrillScenario.slice().find(e => e.id == id);
    }

    @computed
    get allItems(): MockDrillScenario[] {
        return this._mockDrillScenario.slice();
    }

}

export const MockDrillScenarioMasterStore = new Store();