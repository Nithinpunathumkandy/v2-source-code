
import { observable, action, computed } from "mobx-angular";
import { IncidentInfoWorkflowDetail, IncidentInfoWorkflowHistory, IncidentInfoWorkflowHistoryPaginationResponse } from "src/app/core/models/incident-management/incident-workflow/incident-Info-workflow";

class Store {
    @observable
    private _incidentInfoWorkflowList;

    @observable
    loaded: boolean = false;

    @observable
    private _incidentInfoWorkflowHistory;

    @observable
    historyLoaded: boolean = false;

    
    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;


    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';


    @observable
    orderItem = 'risk_imapct_analysis.id';

    @observable
    type: string;

    @observable
    commentForm:boolean=false;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setWorkflowDetails(response: IncidentInfoWorkflowDetail) {
        this._incidentInfoWorkflowList = response;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }

    
    @computed
    get workflowDetails(): IncidentInfoWorkflowDetail[] {
        return this._incidentInfoWorkflowList;
    }


    @action
    setWorkflowHistory(response: IncidentInfoWorkflowHistoryPaginationResponse) {
        this._incidentInfoWorkflowHistory = response.data;
         this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        
        this.historyLoaded = true;
        //this.updateUserJob(response.data);
    }

    
    @computed
    get workflowHistoryDetails(): IncidentInfoWorkflowHistory {
        return this._incidentInfoWorkflowHistory;
    }




}

export const IncidentInfoWorkflowStore = new Store();