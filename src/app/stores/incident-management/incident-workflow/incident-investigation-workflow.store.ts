
import { observable, action, computed } from "mobx-angular";
import { IncidentInvestigationWorkflowDetail, IncidentInvestigationWorkflowHistory, IncidentInvestigationWorkflowHistoryPaginationResponse } from "src/app/core/models/incident-management/incident-workflow/incident-investigation-workflow";
import { RiskInfoWorkflowDetail,RiskWorkflowHistory, RiskWorkflowHistoryPaginationResponse } from "src/app/core/models/risk-management/risks/risk-info-workflow";

class Store {
    @observable
    private _investigationWorkflowList;

    @observable
    loaded: boolean = false;

    @observable
    private _riskWorkflowHistory;

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
    setWorkflowDetails(response: IncidentInvestigationWorkflowDetail) {
        this._investigationWorkflowList = response;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }

    
    @computed
    get workflowDetails(): IncidentInvestigationWorkflowDetail[] {
        return this._investigationWorkflowList;
    }


    @action
    setWorkflowHistory(response: IncidentInvestigationWorkflowHistoryPaginationResponse) {
        this._riskWorkflowHistory = response.data;
         this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        
        this.historyLoaded = true;
        //this.updateUserJob(response.data);
    }

    
    @computed
    get workflowHistoryDetails(): IncidentInvestigationWorkflowHistory {
        return this._riskWorkflowHistory;
    }

    @action
    unsetWorkflowDetails(){
        this._riskWorkflowHistory = null;
        this.historyLoaded = false;
        this._investigationWorkflowList = null;
        this.loaded = false;
    }

}

export const IncidentInvestigationWorkflowStore = new Store();