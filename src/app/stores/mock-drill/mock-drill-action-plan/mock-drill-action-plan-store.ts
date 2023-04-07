import { observable, action, computed } from "mobx-angular";
import { HistoryResponse, MockDrillActionPlanDetails, MockDrillActionPlanPaginationResponse, MockDrillActionPlans } from "src/app/core/models/mock-drill/mock-drill-action-plan/mock-drill-action-plan";
import { Image } from "src/app/core/models/image.model";
class Store {

    @observable
    private _mockDrillActionPlans: MockDrillActionPlans[] = [];

    @observable
    loaded: boolean = false;

    @observable
    details_loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'created_at'; // Orger item

    @observable
    private _mockDrillActionPlanDetails: MockDrillActionPlanDetails;

    formType: string;

    @computed
    get allItems(): MockDrillActionPlans[] {
        return this._mockDrillActionPlans.slice();
    }
    @computed
    get selectedPlan(): MockDrillActionPlanDetails {
        return this._mockDrillActionPlanDetails;
    }
    actionPlanId: number;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    searchText: string;

    @observable
    historyOrderBy: 'asc' | 'desc' = 'desc';

    @observable
    historyOrderItem: string = 'created_at';

    @observable
    historyCurrentPage: number = 1;

    @observable
    historyItemsPerPage: number = null;

    @observable
    historyTotalItems: number = null;

    @observable
    actionPlanHistoryLoaded: boolean = false;

    selected: number;

    @observable
    editFlag: boolean = false;

    @observable
    individualLoaded: boolean = false;

    @observable
    from: number = null;

    @observable
    action_plan_update: boolean = false;

    @observable
    action_plan_history: boolean = false;

    @observable
    _actionPlanHistoryData: any[] = [];

    @observable
    private _documentDetails: Image[] = [];

    @observable
    preview_url: string;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setActionPlanId(id) {
        this.actionPlanId = id;
    }
    @action
    setActionPlans(response: MockDrillActionPlanPaginationResponse) {

        this._mockDrillActionPlans = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unSetActionPlans() {
        this._mockDrillActionPlans = [];
        this.currentPage = null;
        this.itemsPerPage = null;
        this.totalItems = null;
        this.from = null;
        this.loaded = false;
    }
    @action
    setHistoryCurrentPage(current_page: number) {
        this.historyCurrentPage = current_page;
    }
    @action
    setActionPlanHistory(response: HistoryResponse) {
        this._actionPlanHistoryData = response.data;
        this.historyCurrentPage = response.current_page;
        this.historyItemsPerPage = response.per_page;
        this.historyTotalItems = response.total;
        this.actionPlanHistoryLoaded = true;
    }
    @action
    unSetActionPlanHistory() {
        this._actionPlanHistoryData = [];
        this.actionPlanHistoryLoaded = false;
        this.historyCurrentPage = null;
        this.historyItemsPerPage = null;
        this.historyTotalItems = null;
    }

    @action
    setIndividualActionPlansDetails(details: MockDrillActionPlanDetails) {
        this.individualLoaded = true;
        this._mockDrillActionPlanDetails = details;
    }
    @computed
    get historyData(): History[] {
        return this._actionPlanHistoryData.slice();
    }
    @action
    unsetIndividualActionPlansDetails() {
        this.individualLoaded = false;
        this._mockDrillActionPlanDetails = null;
    }
    @action
    setDocumentDetails(details: Image, url: string) {

        this._documentDetails.push(details);
        this.preview_url = url;
    }

    @computed
    get docDetails(): Image[] {
        return this._documentDetails.slice();
    }

    @action
    unsetDocumentDetails(token?: string) {

        var b_pos = this._documentDetails.findIndex(e => e.token == token)
        if (b_pos != -1) {
            if (this._documentDetails[b_pos].hasOwnProperty('is_new')) {
                this._documentDetails.splice(b_pos, 1);
            }
            else {
                this._documentDetails[b_pos]['is_deleted'] = true;
            }
        }
    }

    @action
    clearDocumentDetails() {
        this._documentDetails = [];
        this.preview_url = null;
    }
}

export const MockDrillActionPlanStore = new Store()