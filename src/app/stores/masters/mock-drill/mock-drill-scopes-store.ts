import { action, computed, observable } from "mobx";
import { MockDrillScopes, MockDrillScopesPaginationResponse, MockDrillScopesSingle } from "src/app/core/models/masters/mock-drill/mock-drill-scopes";


class Store {
    @observable
    private _mockDrillScopes: MockDrillScopes[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'mock_drill_scopes.created_at';

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
    individualMockDrillScopes: MockDrillScopesSingle;

    searchText: string;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setMockDrillScopes(response: MockDrillScopesPaginationResponse) {
        this._mockDrillScopes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.from = response.from;
        this.loaded = true;
    }
    @computed
    get allItems(): MockDrillScopes[] {
        return this._mockDrillScopes.slice();
    }
}
export const MockDrillScopesMasterStore = new Store();