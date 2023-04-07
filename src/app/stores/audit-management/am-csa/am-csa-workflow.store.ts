
import { observable, action, computed } from "mobx-angular";
import { AuditPlanWorkflowDetail, AuditPlanWorkflowHistory, AuditPlanWorkflowHistoryPaginationResponse } from "src/app/core/models/audit-management/am-audit-plan/am-audit-plan-workflow";

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
    orderItem = 'am-audit-plan.id';

    @observable
    type: string;

    @observable
    approveText: string;

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
    setWorkflowDetails(response: AuditPlanWorkflowDetail) {
        this._auditWorkflowList = response;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }

    
    @computed
    get workflowDetails(): AuditPlanWorkflowDetail[] {
        return this._auditWorkflowList;
    }


    @action
    setWorkflowHistory(response: AuditPlanWorkflowHistoryPaginationResponse) {
        this._auditWorkflowHistory = response.data;
         this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        
        this.historyLoaded = true;
        //this.updateUserJob(response.data);
    }

    
    @computed
    get workflowHistoryDetails(): AuditPlanWorkflowHistory {
        return this._auditWorkflowHistory;
    }




}

export const AmCSAWorkflowStore = new Store();