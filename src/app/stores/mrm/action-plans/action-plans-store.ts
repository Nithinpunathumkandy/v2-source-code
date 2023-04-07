import { action, computed, observable } from "mobx-angular";
import { Image } from "src/app/core/models/image.model";
import { ActionPlans, ActionPlansResponse, History, HistoryResponse } from "src/app/core/models/mrm/action-plans/action-plans";

class Store {

    @observable
    _actionPlans: ActionPlans[] = [];

    @observable
    _individualActionPlansDetails: ActionPlans;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = '';

    @observable
    path: string = '../';

    @observable
    searchText: string;

    @observable
    loaded: boolean = false;

    @observable
    individualLoaded: boolean = false;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    currentPage: number = 1;

    @observable
    editFlag: boolean = true;

    @observable
    private _documentDetails: Image[] = [];

    @observable
    preview_url: string;

    @observable
    action_plan_update:boolean = false;

    @observable
    action_plan_history:boolean = false;

    @observable
    _actionPlanHistoryData:History[]= [];

    @observable
    historyOrderBy: 'asc' | 'desc' = 'desc';

    @observable
    historyOrderItem: string = '';

    @observable
    historyCurrentPage: number = 1;

    @observable
    historyItemsPerPage: number = null;

    @observable
    historyTotalItems: number = null;

    @observable
    actionPlanHistoryLoaded: boolean = false;

    @observable
    actionId: number = null;

    selected: number;

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

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setActionPlans(response: ActionPlansResponse) {

        this._actionPlans = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unSetActionPlans() {
        this._actionPlans = [];
        this.currentPage = null;
        this.itemsPerPage = null;
        this.totalItems = null;
        this.from = null;
        this.loaded = false;
    }

    @computed
    get allItems(): ActionPlans[] {
        return this._actionPlans.slice();
    }

    @action
    setIndividualActionPlansDetails(details: ActionPlans) {
        this.individualLoaded = true;
        this._individualActionPlansDetails = details;
    }

    @action
    unsetIndividualActionPlansDetails() {
        this.individualLoaded = false;
        this._individualActionPlansDetails = null;
    }

    @computed
    get individualActionPlansDetails(): ActionPlans {
        return this._individualActionPlansDetails;
    }

    @action
    setSelected(value:number){
        this.selected = value;
    }

    get selectedItem():number{
        return this.selected;
    }

    @computed
    get initialItemId():number{
        return this._actionPlans[0].id
    }


    @action
    ActionPlansloadedList() {
        this.loaded = true;
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
    setHistoryCurrentPage(current_page: number) {
        this.historyCurrentPage = current_page;
    }
    
    @computed
    get historyData(): History[] {
        return this._actionPlanHistoryData.slice();
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
    setPath( url: string) {
        this.path = url;
    }

}

export const ActionPlansStore = new Store();
