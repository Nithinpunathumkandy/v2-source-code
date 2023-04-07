
import { observable, action, computed } from "mobx-angular";
import { ComplianceRegisterWorkflowDetail, ComplianceRegisterWorkflowHistory, ComplianceRegisterWorkflowHistoryPaginationResponse } from "src/app/core/models/compliance-management/compliance-workflow/compliance-register-workflow";

class Store {
    @observable
    private _ComplianceRegisterWorkflowList;

    @observable
    loaded: boolean = false;

    @observable
    private _ComplianceRegisterWorkflowHistory;

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
    setWorkflowDetails(response: ComplianceRegisterWorkflowDetail) {
        this._ComplianceRegisterWorkflowList = response;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }

    
    @computed
    get workflowDetails(): ComplianceRegisterWorkflowDetail[] {
        return this._ComplianceRegisterWorkflowList;
    }


    @action
    setWorkflowHistory(response: ComplianceRegisterWorkflowHistoryPaginationResponse) {
        this._ComplianceRegisterWorkflowHistory = response.data;
         this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        
        this.historyLoaded = true;
        //this.updateUserJob(response.data);
    }

    
    @computed
    get workflowHistoryDetails(): ComplianceRegisterWorkflowHistory {
        return this._ComplianceRegisterWorkflowHistory;
    }




}

export const ComplianceRegisterWorkflowStore = new Store();