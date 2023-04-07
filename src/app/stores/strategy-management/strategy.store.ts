import { observable, action, computed } from 'mobx-angular';
import { Image } from "src/app/core/models/image.model";
import { FocusAreas, historyData, historyPaginationData, InduvalObjectives, InduvalStrategyProfile, KpiResponse, NoteDetails, Objectives, Strategy, StrategyObjectiveReviewUser, StrategyProfileNote, StrategyProfileResponse, StrategyProfileReviewUser } from 'src/app/core/models/strategy-management/strategy.model';

class Store {

    @observable
    _stratergyProfiles: Strategy[] = []

    @observable
    __individualProfile = null;

    @observable
    __selectedStrategyProfileReviewUser: StrategyProfileReviewUser[] = [];

    @observable
    _selectedStrategyObjectiveReviewUser: StrategyObjectiveReviewUser[] = [];

    @observable
    individualLoaded = false

    @observable
    loaded: boolean = false;

    @observable
    allProfileLoaded: boolean = false;

    @observable
    objectiveTargetBreakdownLoaded: boolean = false;

    @observable
    totalFocusAreaWeightage = 0;

    @observable
    selectedKpiItem = 0;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'strategy_profiles.reference_code';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    searchText: string;

    @observable
    setNotes: number

    @observable
    currentTab = ''

    @observable
    _strategyProfileId: number = null;

    @observable
    _profileNotes: StrategyProfileNote[] = []

    @observable
    _focusAreas: FocusAreas[] = []

    @observable
    _focusAreasForFilter: FocusAreas[] = []

    @observable
    _selectedProfileNotes = [];

    @observable
    _objectiveTargetBreakdown;

    @observable
    _objectives: Objectives[] = []

    @observable
    _kpis: KpiResponse[] = []

    @observable
    _induvalObjectives: InduvalObjectives = null

    @observable
    _noteId = null

    @observable
    _startDate = null

    @observable
    _endDate = null

    @observable
    _noteDetails: NoteDetails = null


    @observable
    _focusAreaId: number = null

    @observable
    _objectiveId: number = null

    @observable
    notesLoaded: boolean = false;

    @observable
    notesDetailLoaded: boolean = false;

    @observable
    focusAreaLoaded: boolean = false;

    @observable
    objectivesLoaded: boolean = false;

    @observable
    induvalObjectivesLoaded: boolean = false;

    @observable
    private _documentDetails: Image = null;

    @observable
    preview_url: string;

    @observable
    start_date: any;

    @observable
    end_date: any;

    @observable
    remainingWeightage

    @observable
    _induavalKpi = null;

    @observable
    historyItem: historyData[] = [];

    @observable
    historyLoaded: boolean = false;

    @observable
    historyCurrentPage: number = 1;

    @observable
    historyItemsPerPage: number = null;

    @observable
    historyTotalItems: number = null;

    @observable
    induvalKpiLoaded = false;

    @observable
    backToDashboard = false;

    @observable
    lastPage = 'profile';

    @action
    clearDocumentDetails() {
        this._documentDetails = null;
        this.preview_url = null;
    }
    @action
    setDocumentDetails(details: Image, url: string) {
        this._documentDetails = details;
        this.preview_url = url;

    }

    get docDetails() {
        return this._documentDetails
    }

    @action
    unsetDocumentDetails(token?: string) {


        if (this._documentDetails.hasOwnProperty('is_new')) {
            this._documentDetails = null;
        }
        else {
            this._documentDetails['is_deleted'] = true;
        }

        //this._brocureDetails = null;
        //this.brochure_preview_url = null;



    }


    @action
    setInduvalKpi(data) {
        this._induavalKpi = data;
        this.induvalKpiLoaded = true
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setProfiles(response: StrategyProfileResponse) {
        this._stratergyProfiles = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;

    }


    @computed
    get induvalKpi() {
        return this._induavalKpi
    }

    @computed
    get allItems(): Strategy[] {
        return this._stratergyProfiles.slice();
    }

    @action
    setAllProfiles(response: Strategy[]) {
        this._stratergyProfiles = response;
        this.allProfileLoaded = true;
    }

    @computed
    get allIProfiletems(): Strategy[] {
        return this._stratergyProfiles;
    }

    @action
    unsetProfiles() {
        this._stratergyProfiles = [];
        this.loaded = false;
    }

    @action
    setFocusAreaId(id: number) {
        this._focusAreaId = id
    }

    @action
    unsetFocusAreaId() {
        this._focusAreaId = null
    }

    get focusAreaId() {
        return this._focusAreaId
    }

    @action
    setObjectiveId(id: number) {
        this._objectiveId = id
    }

    @action
    unsetObjectiveId() {
        this._objectiveId = null
    }

    get objectiveId() {
        return this._objectiveId
    }

    @action
    setSelectedId(id: number) {
        this._strategyProfileId = id
    }

    get strategyProfileId() {
        return this._strategyProfileId
    }

    @action
    setProfileNots(notes: StrategyProfileNote[]) {
        this._profileNotes = notes
        this.notesLoaded = true

    }

    get profileNotes() {
        return this._profileNotes
    }

    @action
    setFocusAreas(focusAre: FocusAreas[]) {
        this._focusAreas = focusAre
        this.focusAreaLoaded = true

    }

    get focusAreas() {
        return this._focusAreas
    }

    @action
    setFocusAreasForFilter(focusAre: FocusAreas[]) {
        this._focusAreasForFilter = focusAre
    }

    get focusAreasForFilter() {
        return this._focusAreasForFilter
    }

    @action
    setSelectedProfileNotes(notes) {
        this._selectedProfileNotes = notes
    }

    get getSelectedProfileNotes() {
        return this._selectedProfileNotes
    }

    @action
    setObjectiveTargetBreakdown(objectiveTarget) {
        this._objectiveTargetBreakdown = objectiveTarget;
        this.objectiveTargetBreakdownLoaded = true;
    }

    get getObjectiveTargetBreakdown() {
        return this._objectiveTargetBreakdown
    }
    @action
    setObjectives(object: Objectives[]) {
        this._objectives = object
        this.objectivesLoaded = true

    }
    get objectives() {
        return this._objectives
    }

    @action
    setKpis(object: KpiResponse[]) {
        this._kpis = object

    }
    get kpis() {
        return this._kpis
    }

    @action
    unsetKpis() {
        this._kpis = [];
    }

    @action
    setInduvalObjectives(object: InduvalObjectives) {
        this._induvalObjectives = object;
        this._selectedStrategyObjectiveReviewUser = object.review_users;
        this.induvalObjectivesLoaded = true
    }

    get induvalObjectives() {
        return this._induvalObjectives
    }

    get strategyObjectiveReviewUser() {
        return this._selectedStrategyObjectiveReviewUser;
    }

    @action
    setIndividualStrategyProfile(profile: InduvalStrategyProfile) {
        this.__individualProfile = profile;
        this.individualLoaded = true;
        this.__selectedStrategyProfileReviewUser = profile.review_users
    }

    get induvalStrategyProfile() {
        return this.__individualProfile
    }

    get strategyProfileReviewUser() {
        return this.__selectedStrategyProfileReviewUser;
    }

    @action
    setNoteDetails(res: NoteDetails) {
        this.notesDetailLoaded = true;
        this._noteDetails = res
    }

    get noteDetails() {
        return this._noteDetails
    }

    @action
    setNoteId(id: number) {
        this._noteId = id
    }

    get noteId() {
        return this._noteId
    }

    @action
    setObjectiveStartDate(date) {
        this._startDate = date
    }

    @action
    setObjectiveEndDate(date) {
        this._endDate = date
    }

    get objectiveStartDate() {
        return this._startDate
    }

    get objectiveEndDate() {
        return this._endDate
    }

    @action
    setHistory(response: historyPaginationData) {
        this.historyItem = response.data;
        this.historyCurrentPage = response.current_page;
        this.historyItemsPerPage = response.per_page;
        this.historyTotalItems = response.total;
        this.historyLoaded = true;
    }

    @computed
    get historyData(): historyData[] {
        return this.historyItem;
    }

    @action
    unsetHistory() {
        this.historyItem = null;
        this.historyLoaded = false;
    }

    @action
    setHistoryCurrentPage(current_page: number) {
        this.historyCurrentPage = current_page;
    }
}
export const StrategyStore = new Store();