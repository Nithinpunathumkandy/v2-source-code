import { action, computed, observable } from "mobx-angular";
import { MockDrillSingle, MockDrillTypes, MockDrillTypesPaginationResponse } from "src/app/core/models/masters/mock-drill/mock-drill-types";

class Store {
    @observable
    private _mockDrillTypes: MockDrillTypes[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'mock_drill_types.created_at';

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
    individualMockDrill: MockDrillSingle;

    @observable
    individualLoaded: boolean = false;

    searchText: string;

    @action
    setMockDrillTypes(response: MockDrillTypesPaginationResponse) {
        this._mockDrillTypes = response.data;
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

    // @action
    // updateAuditDocumentType(type: any) {
    //     const types: AmAuditDocumentTypes[] = this._amAuditDocumentTypes.slice();
    //     const index: number = types.findIndex(e => e.id == type.id);
    //     if (index != -1) {
    //         types[index] = type;
    //         this._amAuditDocumentTypes=types;
    //     }
    // }

    @action
    setLastInserted(id: number) {
        this.lastInsertedId = id;
    }

    @action
    setindividualMockDrill(mockDrill: MockDrillSingle) {
        this.individualMockDrill = mockDrill;
        this.individualLoaded = true;
    }



    @action
    getDocumentTypeById(id: number): MockDrillTypes {
        return this._mockDrillTypes.slice().find(e => e.id == id);
    }

    @computed
    get allItems(): MockDrillTypes[] {
        return this._mockDrillTypes.slice();
    }

}

export const MockDrillTypesMasterStore = new Store();