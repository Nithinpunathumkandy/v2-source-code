import { observable, action, computed } from 'mobx-angular';
import { KpiflowDetail, KpiflowHistory, KpiflowHistoryPaginationResponse } from 'src/app/core/models/strategy-management/kpi-workflow.model';

class store {
    @observable
    private _kpiWorkflowList ;

    @observable
    loaded: boolean = false;

    @observable
    private _kpiWorkflowHistory ;

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
    setWorkflowDetails(response: KpiflowDetail) {
        this._kpiWorkflowList = response;
        this.loaded = true;
    }
    @computed
    get workflowDetails(): KpiflowDetail {
        return this._kpiWorkflowList;
    }

    @action
    setWorkflowHistory(response: KpiflowHistoryPaginationResponse) {
        this._kpiWorkflowHistory = response.data;
         this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.historyLoaded = true;
    }
    
    @computed
    get workflowHistoryDetails(): KpiflowHistory {
        return this._kpiWorkflowHistory;
}
}
export const KpiWorkflowStore = new store()