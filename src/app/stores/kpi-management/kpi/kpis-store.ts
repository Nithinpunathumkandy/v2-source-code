import { observable, action, computed } from "mobx-angular";
import { IndividualKpi, IndividualKpiWorkFlow, KpiPaginationResponse, WorkflowHistory, WorkflowHistoryPaginationResponse } from "src/app/core/models/kpi-management/kpi/kpi";
class Store{

    @observable
    private _kpi: IndividualKpi[] = [];
    
    @observable
    private _individualKpiDetails: IndividualKpi;

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = 15;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    orderItem: string = '';

    @observable
    last_page: number = null;

    @observable
    editFlag: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    individualLoaded: boolean = false;

    @observable
    showKpiScoreUpdateTab: boolean = true;

    searchText: string;

    @observable
    kpiId: number = null;

    // form modal
    
    @observable
    kpiformModal:boolean=false;
    
    @observable
    workflow_form_modal:boolean=false;
    
    @observable
    workflow_history_form_modal:boolean=false;
    
    @observable
    activity_log_form_modal:boolean=false;

    @observable
    saveSelected: boolean = false;

    @observable
    selectedKpiForMapping: IndividualKpi[]=[];

    @observable
    kpi_select_form_modal:boolean=false;

    // **form modal

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setKpi(response: KpiPaginationResponse) {

        this._kpi = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unSetKpi(){
        this.loaded = false;
        this.from = null;
        this.totalItems = null;
        this.currentPage = null;
        this._kpi = [];
        this.itemsPerPage = null;
    }

    @computed
    get allItems(): IndividualKpi[] {
        return this._kpi.slice();
    }

    @action
    setKpiId(id: number) {
        this.kpiId = id;
    }

    @action
    setEditFlag() {
        this.editFlag = true;
    }

    @action
    unsetEditFlag() {
        this.editFlag = false;
    }

    //*Detials
    @action
    setIndividualKpiDetails(details: IndividualKpi) {
        this.individualLoaded = true;
        this._individualKpiDetails = details;
    }

    @action
    unsetIndividualKpiDetails() {
        this.individualLoaded = false;
        this._individualKpiDetails = null;
    }
    
    @computed
    get individualKpiDetails(): IndividualKpi {
        return this._individualKpiDetails;
    }

    //**Detials

    // workflow

    @observable
    private _individualKpiWorkflowDetails;

    @observable
    workloaded:boolean=false;

    @action
    setWorkflowDetails(response: IndividualKpiWorkFlow) {
        this._individualKpiWorkflowDetails = response;
        this.workloaded = true;
    }

    @action
    unsetIndividualWorkFlow() {
        this.workloaded = false;
        this._individualKpiWorkflowDetails = null;
    }

    @computed
    get workflowDetails(): IndividualKpiWorkFlow[] {
        return this._individualKpiWorkflowDetails;
    }

    // **workflow

    // WorkFlow History
    @observable
    private _workflowHistory;

    @observable
    historyLoaded: boolean = false;

    @action
    setWorkflowHistory(response: WorkflowHistoryPaginationResponse) {
        this._workflowHistory = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        
        this.historyLoaded = true;
    }

    @action
    unSetWorkflowHistory(){
        this.historyLoaded = false;
        this.from = null;
        this.totalItems = null;
        this.currentPage = null;
        this.itemsPerPage = null;
    }

    @computed
    get workflowHistoryDetails(): WorkflowHistory {
        return this._workflowHistory;
    }

    //** WorkFlow History

     // Char 
    @observable
    private _scoreByFrequencyChart;

    @observable
    cahrtLoaded: boolean = false;

    @action
    setIndividualKpiChart(response: any) {
    this._scoreByFrequencyChart = response;
    this.cahrtLoaded = true;
    }

    @action
    unSetIndividualKpiChart(){
        this.cahrtLoaded = false;
        this._scoreByFrequencyChart=[];
    }

    @computed
    get scoreByFrequencyChart(): any {
        return this._scoreByFrequencyChart;
    }

    //** Chart


    //MS Type
    @observable // not need
    msClauseArray: any[] = [];

    
    @action
    pushId(id){
        this.msClauseArray.push(id);
    }

    @action
    removeId(id){
        const index = this.msClauseArray.indexOf(id);
        this.msClauseArray.splice(index, 1);
    }

    @action
    checkId(id):any{
        return  this.msClauseArray.includes(id);
    }

    @computed
    get allClauseItemsArray(): any {
        return this.msClauseArray;
    }

    @action
    emptyArray(){
    this.msClauseArray=[];
    }

    addSelectedKpi(issues){
        this.selectedKpiForMapping = issues;
    }
}
export const KpisStore = new Store();