
import { observable, action, computed } from "mobx-angular";
import { RiskInfoWorkflowDetail,RiskWorkflowHistory, RiskWorkflowHistoryPaginationResponse } from "src/app/core/models/risk-management/risks/risk-info-workflow";

class Store {
    @observable
    private _riskWorkflowList;

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
    setWorkflowDetails(response: RiskInfoWorkflowDetail) {
        this._riskWorkflowList = response;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }

    
    @computed
    get workflowDetails(): RiskInfoWorkflowDetail[] {
        return this._riskWorkflowList;
    }


    @action
    setWorkflowHistory(response: RiskWorkflowHistoryPaginationResponse) {
        this._riskWorkflowHistory = response.data;
         this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        
        this.historyLoaded = true;
        //this.updateUserJob(response.data);
    }

    
    @computed
    get workflowHistoryDetails(): RiskWorkflowHistory {
        return this._riskWorkflowHistory;
    }




}

export const RiskJourneyWorkflowStore = new Store();