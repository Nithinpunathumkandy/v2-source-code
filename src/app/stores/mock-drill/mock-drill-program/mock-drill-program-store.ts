import { action, computed, observable } from 'mobx';
import { IndividualMockDrillProgram, MockDrillProgram, MockDrillProgramPaginationResponse, ProgramMapping } from 'src/app/core/models/mock-drill/mock-drill-program/mock-drill-program';

class Store {
    @observable
    private _mockDrillProgram: MockDrillProgram[] = []

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    orderItem: string = 'mock_drill_program.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    searchText: string;

    @observable
    mock_drill_program_id: number = null;

    @observable
    lastCreatedMockDrillProgramId: number = null;

    @observable
    individualLoaded: boolean = false;

    @observable
    selectedProgram: IndividualMockDrillProgram;

    @computed
    get allItems(): MockDrillProgram[] {
        return this._mockDrillProgram.slice();
    }
    @observable
    mappingList: ProgramMapping;

    @observable
    preplanList: any;
    // @computed
    // get mockDrillProgramList(): MockDrillProgram[] {
    //     return this._mockDrillProgram;
    // }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setMockDrillProgram(response: MockDrillProgramPaginationResponse) {
        this._mockDrillProgram = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    unsetMockDrillProgram() {
        this._mockDrillProgram = [];
        this.loaded = false;
    }

    @action
    setMockDrillProgramId(id: number) {
        this.mock_drill_program_id = id;
    }
    @action
    unsetMockDrillProgramId() {
        this.mock_drill_program_id = 0;
    }

    @action
    setIndividualMockDrillProgram(details: IndividualMockDrillProgram) {
        this.selectedProgram = details;
    }

    @action
    setPreplan(details: any) {
        this.preplanList = details;
    }
    @action
    unsetPreplan() {
        this.preplanList = null;
    }
    @computed
    get getPreplanList(): any {
        return this.preplanList.slice();
    }

    @computed
    get selectedProgramData(): IndividualMockDrillProgram {
        return this.selectedProgram;
    }
    @action
    unsetIndividualMockDrillProgram() {
        this.selectedProgram = null;
    }

    @action
    getProgramById(id: number): MockDrillProgram {
        return this._mockDrillProgram.slice().find(e => e.id == id);
    }
    @action
    setProgramMappingItems(items: ProgramMapping) {
        this.mappingList = items
        this.mappingIssueItemsLoaded = true;
    }
    @computed
    get mappingItemList(): ProgramMapping {
        return this.mappingList;
    }
    @observable
    mappingIssueItemsLoaded: boolean = false;
}

export const MockDrillProgramStore = new Store();