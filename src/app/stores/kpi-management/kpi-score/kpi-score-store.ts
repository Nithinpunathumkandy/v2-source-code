import { observable, action, computed } from "mobx-angular";
import { IndividualKpiScore, IndividualKpiWorkFlow, KpiScorePaginationResponse, WorkflowHistory, WorkflowHistoryPaginationResponse } from "src/app/core/models/kpi-management/kpi-score/kpi-score";

class Store{

    @observable
    private _kpiScore: IndividualKpiScore[] = [];//List 
    
    @observable
    private _individualKpiScoreDetails: IndividualKpiScore;//Detials

    @observable
    private _individualKpiScoreUpdateScoreDate: IndividualKpiScore;//Update Score Date Detials

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
    path: string = '../';

    searchText: string;

    @observable
    kpiScoreId: number = null;

    //**form Modal
    @observable
    kpiformModal:boolean=false;

    @observable
    workflow_form_modal:boolean=false;
    
    @observable
    workflow_history_form_modal:boolean=false;
    
    @observable
    activity_log_form_modal:boolean=false;
    //**form Modal

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setKpiScore(response: KpiScorePaginationResponse) {

        this._kpiScore = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unSetKpiScore(){
        this.loaded = false;
        this.from = null;
        this.totalItems = null;
        this.currentPage = null;
        this._kpiScore = [];
        this.itemsPerPage = null;
    }

    @computed
    get allItems(): IndividualKpiScore[] {
        return this._kpiScore.slice();
    }

    @action
    setKpiScoreId(id: number) {
        this.kpiScoreId = id;
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
    setIndividualKpiScoreDetails(details: IndividualKpiScore) {
        this.individualLoaded = true;
        this._individualKpiScoreDetails = details;
    }

    @action
    unsetIndividualKpiScoreDetails() {
        this.individualLoaded = false;
        this._individualKpiScoreDetails = null;
    }
    
    @computed
    get individualKpiScoreDetails(): IndividualKpiScore {
        return this._individualKpiScoreDetails;
    }

    @action
    setPath( url: string) {
        this.path = url;
    }

    //**Detials

    //*Update Score Date Detials
    @action
    setIndividualKpiScoreUpdateScoreDate(details: IndividualKpiScore) {
        this._individualKpiScoreUpdateScoreDate = details;
    }

    @action
    unsetIndividualKpiScoreUpdateScoreDate() {
        this._individualKpiScoreUpdateScoreDate = null;
    }
    
    @computed
    get individualKpiScoreUpdateScoreDate(): IndividualKpiScore {
        return this._individualKpiScoreUpdateScoreDate;
    }

    //**Update Score Date Detials

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
}
export const KpiScoreStore = new Store();