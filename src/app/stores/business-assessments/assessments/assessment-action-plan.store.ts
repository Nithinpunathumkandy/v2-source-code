import { observable, action, computed } from "mobx-angular";
import {ActionPlans,BAActionPlanDetails,BAActionPlanPaginationResponse,HistoryResponse,History} from 'src/app/core/models/business-assessments/action-plans/action-plan'
class Store{

    @observable
    private _baActionPlans: ActionPlans[] = [];

    @observable
    loaded: boolean = false;

    @observable
    details_loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'business_assessments.reference_code';

    @observable
    private _baActionPlanDetails: BAActionPlanDetails;

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
        return this._baActionPlans[0].id
    }

    @action
    setBAActionPlans(response: BAActionPlanPaginationResponse) {
        this._baActionPlans = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
    }

    @action
    unsetBAActionPlans() {
        this._baActionPlans = [];
        this.loaded = false;
    }

    @action
    setBAActionPlanDetails(details:BAActionPlanDetails) {
        this.details_loaded = true;
        this._baActionPlanDetails = details;
    }

    @action
    unsetBAACtionPlanDetails() {
        this._baActionPlanDetails = null;
        this.details_loaded = false;
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
    get BAActionPlans():ActionPlans[]{
        return this._baActionPlans
    }
    
    get BAActionPlanDetails():BAActionPlanDetails{
        return this._baActionPlanDetails
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
    

}

export const BAActionPlanStore = new Store()