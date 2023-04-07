
import { observable, action, computed } from "mobx-angular";
import { IncidentCaWorkflowDetail, IncidentCaWorkflowHistory, IncidentCaWorkflowHistoryPaginationResponse } from "src/app/core/models/incident-management/incident-workflow/incident-ca-workflow";

class Store {
    @observable
    private _incidentCaWorkflowList;

    @observable
    loaded: boolean = false;

    @observable
    private _incidentCaWorkflowHistory;

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
    setWorkflowDetails(response: IncidentCaWorkflowDetail) {
        this._incidentCaWorkflowList = response;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }

    
    @computed
    get workflowDetails(): IncidentCaWorkflowDetail[] {
        return this._incidentCaWorkflowList;
    }


    @action
    setWorkflowHistory(response: IncidentCaWorkflowHistoryPaginationResponse) {
        this._incidentCaWorkflowHistory = response.data;
         this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        
        this.historyLoaded = true;
        //this.updateUserJob(response.data);
    }

    
    @computed
    get workflowHistoryDetails(): IncidentCaWorkflowHistory {
        return this._incidentCaWorkflowHistory;
    }




}

export const IncidentCaWorkflowStore = new Store();