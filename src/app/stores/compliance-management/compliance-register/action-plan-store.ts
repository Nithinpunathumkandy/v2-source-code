import { observable, action, computed } from "mobx-angular";
import { ComplianceRegisterActionPlanPaginationResponse, ComplianceRegisterActionPlanDetails,HistoryResponse,History,ActionPlans} from 'src/app/core/models/compliance-management/compliance-action-plan/compliance-action-plan';
class Store{

    @observable
    private _complianceRegisterActionPlans: ActionPlans[] = [];

    @observable
    loaded: boolean = false;

    @observable
    details_loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'business_assessments.reference_code';

    @observable
    private _complianceRegisterActionPlanDetails: ComplianceRegisterActionPlanDetails;

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
        return this._complianceRegisterActionPlans[0].id
    }

    @action
    setComplianceRegisterActionPlans(response: ComplianceRegisterActionPlanPaginationResponse) {
        this._complianceRegisterActionPlans = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
    }

    @action
    clearComplianceRegisterActionPlans() {
        this._complianceRegisterActionPlans = [];
        this.loaded = false;
    }

    @action
    setComplianceRegisterActionPlanDetails(details:ComplianceRegisterActionPlanDetails) {
        this.details_loaded = true;
        this._complianceRegisterActionPlanDetails = details;
    }

    @action
    clearComplianceRegisterActionPlanDetails() {
        this._complianceRegisterActionPlanDetails = null;
        this.details_loaded = false;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setDisplayData(data){
        this._displayData.splice(0,0,data)
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
    get complianceRegisterActionPlans():ActionPlans[]{
        return this._complianceRegisterActionPlans
    }
    
    get complianceRegisterActionPlanDetails():ComplianceRegisterActionPlanDetails{
        return this._complianceRegisterActionPlanDetails
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

export const ComplianceRegisterActionPlanStore = new Store()