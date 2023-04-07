import { action, computed, observable } from "mobx-angular";
import { MockDrillEvacuationRoleSingle, MockDrillEvacuationRole, MockDrillEvacuationRolePaginationResponse } from "src/app/core/models/masters/mock-drill/mock-drill-evacuation-role";

class Store {
    @observable
    private _mockDrillEvacuationRole: MockDrillEvacuationRole[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'mock_drill_evacuation_role.created_at';

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
    individualMockDrill: MockDrillEvacuationRoleSingle;

    @observable
    individualLoaded: boolean = false;

    searchText: string;

    @action
    setMockDrillEvacuationRole(response: MockDrillEvacuationRolePaginationResponse) {
        this._mockDrillEvacuationRole = response.data;
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
    setindividualMockDrillEvacuationRole(mockDrill: MockDrillEvacuationRoleSingle) {
        this.individualMockDrill = mockDrill;
        this.individualLoaded = true;
    }



    @action
    getDocumentEvacuationRoleById(id: number): MockDrillEvacuationRole {
        return this._mockDrillEvacuationRole.slice().find(e => e.id == id);
    }

    @computed
    get allItems(): MockDrillEvacuationRole[] {
        return this._mockDrillEvacuationRole.slice();
    }

}

export const MockDrillEvacuationRoleMasterStore = new Store();