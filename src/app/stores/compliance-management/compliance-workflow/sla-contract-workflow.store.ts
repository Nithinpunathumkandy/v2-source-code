
import { observable, action, computed } from "mobx-angular";
import { SlaContractWorkflowDetail, SlaContractWorkflowHistory, SlaContractWorkflowHistoryPaginationResponse } from "src/app/core/models/compliance-management/compliance-workflow/sla-contract-workflow";

class Store {
    @observable
    private _SlaContractWorkflowList;

    @observable
    loaded: boolean = false;

    @observable
    private _SlaContractWorkflowHistory;

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
    setWorkflowDetails(response: SlaContractWorkflowDetail) {
        this._SlaContractWorkflowList = response;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }

    
    @computed
    get workflowDetails(): SlaContractWorkflowDetail[] {
        return this._SlaContractWorkflowList;
    }


    @action
    setWorkflowHistory(response: SlaContractWorkflowHistoryPaginationResponse) {
        this._SlaContractWorkflowHistory = response.data;
         this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        
        this.historyLoaded = true;
        //this.updateUserJob(response.data);
    }

    
    @computed
    get workflowHistoryDetails(): SlaContractWorkflowHistory {
        return this._SlaContractWorkflowHistory;
    }




}

export const SlaContractWorkflowStore = new Store();