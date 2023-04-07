import { observable, action, computed } from "mobx-angular";
import { AuditWorkflowDetail, AuditWorkflowHistory, AuditWorkflowHistoryPaginationResponse } from "src/app/core/models/ms-audit-management/audit-plan-workflow/audit-plan-workflow";

class Store {
    @observable
    private _auditWorkflowList;

    @observable
    loaded: boolean = false;

    @observable
    private _auditWorkflowHistory;

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
    setWorkflowDetails(response: AuditWorkflowDetail) {
        this._auditWorkflowList = response;
        this.loaded = true;
    }
    @computed
    get workflowDetails(): AuditWorkflowDetail[] {
        return this._auditWorkflowList;
    }

    @action
    setWorkflowHistory(response: AuditWorkflowHistoryPaginationResponse) {
        this._auditWorkflowHistory = response.data;
         this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        
        this.historyLoaded = true;
    }
    
    @computed
    get workflowHistoryDetails(): AuditWorkflowHistory {
        return this._auditWorkflowHistory;
    }
}
export const AuditPlanWorkflowStore = new Store();