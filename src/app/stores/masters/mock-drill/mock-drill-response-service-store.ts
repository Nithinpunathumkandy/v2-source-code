import { action, computed, observable } from "mobx-angular";
import { MockDrillSingle, MockDrillResponseService, MockDrillResponseServicePaginationResponse } from "src/app/core/models/masters/mock-drill/mock-drill-response-service";

class Store {
    @observable
    private _mockDrillResponseService: MockDrillResponseService[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'mock_drill_res.created_at';

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
    setMockDrillResponseService(response: MockDrillResponseServicePaginationResponse) {
        this._mockDrillResponseService = response.data;
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
    getDocumentResponseServiceById(id: number): MockDrillResponseService {
        return this._mockDrillResponseService.slice().find(e => e.id == id);
    }

    @computed
    get allItems(): MockDrillResponseService[] {
        return this._mockDrillResponseService.slice();
    }

}

export const MockDrillResponseServiceMasterStore = new Store();