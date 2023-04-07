import { action, computed, observable } from 'mobx';
import { IndividualMockDrill, MockDrill, MockDrillGeneralSettings, MockDrillHistory, MockDrillPaginationResponse, Participants, ResponseServiceChecks } from 'src/app/core/models/mock-drill/mock-drill/mock-drill';


class Store {
    @observable
    private _mockDrill: MockDrill[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individual_mockdrill_loaded: boolean = false;

    @observable
    mockdrill_history_loaded: boolean = false;
    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    orderItem: string = 'mock_drill.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    searchText: string;

    @observable
    mock_drill_id: number = null;

    @observable
    lastCreatedMockDrillId: number = null;

    @observable
    responseServiceId: number = 1

    @observable
    individualLoaded: boolean = false;

    @observable
    selected: IndividualMockDrill;

    @observable
    observation: any[];

    @observable
    participants: Participants[];

    @observable
    mockDrillStatus: string = "";

    @observable
    mockDrillWorkflowStatus: string = "";
    @observable
    responseServiceChecks: ResponseServiceChecks[];

    @observable
    private _mockDrillGeneralSettings: MockDrillGeneralSettings;

    @observable
    mockDrillHistory: MockDrillHistory[];

    @observable
    private _mockdrillWorkflowList;

    @computed
    get allItems(): MockDrill[] {
        return this._mockDrill.slice();
    }
    @computed
    get mockDrillList(): MockDrill[] {
        return this._mockDrill;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setMockDrill(response: MockDrillPaginationResponse) {
        this._mockDrill = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    unsetMockDrill() {
        this._mockDrill = [];
        this.loaded = false;
    }


    @action
    setMockDrillId(id: number) {
        this.mock_drill_id = id;
    }
    @action
    unsetMockDrillId() {
        this.mock_drill_id = 0;
    }
    @action
    setResponseServiceChecks(details: ResponseServiceChecks[]) {
        this.individualLoaded = true;
        this.responseServiceChecks = details;
    }

    @computed
    get responseServiceChecksData(): ResponseServiceChecks[] {
        return this.responseServiceChecks;
    }
    @action
    setparticipantsMockDrill(details: Participants[]) {
        this.individualLoaded = true;
        this.participants = details;
    }
    @computed
    get participantsData(): Participants[] {
        return this.participants;
    }
    @action
    setMockDrillObservations(details: any) {
        this.individualLoaded = true;
        this.observation = details;
    }
    @computed
    get observationData(): any[] {
        return this.observation;
    }
    @computed
    get mockDrillHistoryData(): MockDrillHistory[] {
        return this.mockDrillHistory;
    }
    @action
    setMockDrillHistory(details: MockDrillHistory[]) {
        this.mockdrill_history_loaded = true;
        this.mockDrillHistory = details;
    }


    @action
    setMockDrillStatus(status: string) {
        this.mockDrillStatus = status;
    }

    @computed
    get mockDrillStatusData(): string {
        return this.mockDrillStatus;
    }
    @action
    setIndividualMockDrill(details: IndividualMockDrill) {
        this.individual_mockdrill_loaded = true;
        this.selected = details;
    }

    @computed
    get selectedData(): IndividualMockDrill {
        return this.selected;
    }
    @action
    unsetIndividualMockDrill() {
        this.individual_mockdrill_loaded = false;
        this.selected = null;
    }

    @action
    unsetParticipantsUsers() {
        this.individualLoaded = false;
        this.participants = []
    }
    @action
    unsetObservation() {
        this.individualLoaded = false;
        this.observation = [];
    }
    @action
    unsetMockDrillHistoryUsers() {
        this.mockdrill_history_loaded = false;
        this.mockDrillHistory = null
    }

    @action
    unsetMockDrillStatus() {
        this.mockDrillStatus = "";
    }
    @action
    unsetResponseServiceChecks() {
        this.individualLoaded = false;
        this.responseServiceChecks = []
    }

    @action
    getById(id: number): MockDrill {
        return this._mockDrill.slice().find(e => e.id == id);
    }


    @action
    setMockDrillSettings(settings: MockDrillGeneralSettings) {
        this.loaded = true;
        this._mockDrillGeneralSettings = settings;
    }

    @computed
    get mockDrillSettings(): MockDrillGeneralSettings {
        return this._mockDrillGeneralSettings;
    }

    @action
    setWorkflowDetails(response) {
        this._mockdrillWorkflowList = response;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }


    @computed
    get workflowDetails() {
        return this._mockdrillWorkflowList;
    }

}

export const MockDrillStore = new Store();