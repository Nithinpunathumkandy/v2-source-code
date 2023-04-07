import { observable, action, computed } from "mobx-angular";
import { MockDrillActionPlanStatusPaginationResponse } from "src/app/core/models/mock-drill/mock-action-plan-status/mock-action-plan-status";
import { MockDrillActionPlanStatus } from "src/app/core/models/mock-drill/mock-drill-action-plan/mock-drill-action-plan";

class Store {

    @observable
    private _mockDrillActionPlanStatus: MockDrillActionPlanStatus[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    from: number = null;

    searchText: string;

    @action
    setCurrentPage(currentPage: number) {
        this.currentPage = currentPage;
    }

    @computed
    get allItems(): MockDrillActionPlanStatus[] {
        return this._mockDrillActionPlanStatus.slice();
    }

    @action
    setMockDrillActionPlanStatus(response: MockDrillActionPlanStatusPaginationResponse) {

        // this._mockDrillActionPlanStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }
}

export const MockDrillActionPlanStatusStore = new Store();