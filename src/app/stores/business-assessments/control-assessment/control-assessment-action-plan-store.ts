import { observable, action, computed } from "mobx-angular";
import { Image } from "src/app/core/models/image.model";
import {ActionPlans,CAActionPlanDetails,CAActionPlanPaginationResponse,HistoryResponse,History} from 'src/app/core/models/business-assessments/control-assessment/control-assessment-action-plan'
class Store{

    @observable
    private _caActionPlans: ActionPlans[] = [];

    @observable
    loaded: boolean = false;

    @observable
    detailsLoaded: boolean = false;

    @observable
    private _documentDetails: Image[] = [];

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'control_assessments_action_plan.reference_code';

    @observable
    private _caActionPlanDetails: CAActionPlanDetails;

    @observable
    _displayData = [];

    formType:string;

    actionPlanId:number;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    searchText: string;

    @observable
    preview_url: string;

    
    @observable
    _actionPlanHistoryData:History[]= [];

    actionPlanUpdateModal:boolean=false;
    actionPlanStatusUpdateModal:boolean=false;
    actionPlanStatusHistoryModal:boolean=false;
    
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

    selected: number;

    @action
    setSelected(value:number){
        this.selected = value;
    }

    get selectedItem():number{
        return this.selected;
    }

    @computed
    get initialItemId():number{
        return this._caActionPlans[0].id
    }

    @action
    setCAActionPlans(response: CAActionPlanPaginationResponse) {
        this._caActionPlans = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
    }

    @action
    unsetCAActionPlans() {
        this._caActionPlans = [];
        this.loaded = false;
    }

    @action
    setCAActionPlanDetails(details:CAActionPlanDetails) {
        this.detailsLoaded = true;
        this._caActionPlanDetails = details;
    }

    @action
    unsetCAACtionPlanDetails() {
        this._caActionPlanDetails = null;
        this.detailsLoaded = false;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setDisplayData(data){
        this._displayData.splice(0,0,data)
        // this._displayData=data;

    }

    @action
    unSetDisplayData(){
        this._displayData=[];

    }

    @action
    setActionPlanId(id){
        this.actionPlanId=id;
    }

    @computed
    get CAActionPlans():ActionPlans[]{
        return this._caActionPlans
    }
    
    get CAActionPlanDetails():CAActionPlanDetails{
        return this._caActionPlanDetails
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

export const CAActionPlanStore = new Store()