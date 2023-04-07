import { observable, action, computed } from 'mobx-angular';
import { ActionPlanflowDetail,ActionPlanflowHistoryPaginationResponse,ActionPlanflowHistory } from 'src/app/core/models/strategy-management/action-plan-workflow.model';

class store {
    @observable
    private _actionPlanWorkflowList ;

    @observable
    loaded: boolean = false;

    @observable
    private _actionPlanWorkflowHistory ;

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
    selectedId : number = null

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
    setWorkflowDetails(response: ActionPlanflowDetail) {
        this._actionPlanWorkflowList = response;
        this.loaded = true;
    }
    @computed
    get workflowDetails(): ActionPlanflowDetail {
        return this._actionPlanWorkflowList;
    }

    @action
    setWorkflowHistory(response: ActionPlanflowHistoryPaginationResponse) {
        this._actionPlanWorkflowHistory = response.data;
         this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.historyLoaded = true;
    }
    
    @computed
    get workflowHistoryDetails(): ActionPlanflowHistory {
        return this._actionPlanWorkflowHistory;
}
}
export const ActionPlanWorkflowStore = new store()