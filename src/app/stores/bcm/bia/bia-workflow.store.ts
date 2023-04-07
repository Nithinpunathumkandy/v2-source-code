
import { observable, action, computed } from "mobx-angular";
import { BiaWorkflowDetail, BiaWorkflowHistory, BiaWorkflowHistoryPaginationResponse } from "src/app/core/models/bcm/bia/bia-workflow";

class Store {
    @observable
    private _biaWorkflowList;

    @observable
    loaded: boolean = false;

    @observable
    private _biaWorkflowHistory;

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
    setWorkflowDetails(response: BiaWorkflowDetail) {
        this._biaWorkflowList = response;
        this.loaded = true;
    }
    
    @computed
    get workflowDetails(): BiaWorkflowDetail[] {
        return this._biaWorkflowList;
    }

    @action
    setWorkflowHistory(response: BiaWorkflowHistoryPaginationResponse) {
        this._biaWorkflowHistory = response.data;
         this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        
        this.historyLoaded = true;
    }
    
    @computed
    get workflowHistoryDetails(): BiaWorkflowHistory {
        return this._biaWorkflowHistory;
    }

}

export const BiaWorkflowStore = new Store();