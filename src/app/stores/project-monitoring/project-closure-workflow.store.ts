
import { observable, action, computed } from "mobx-angular";
import { ProjectClosureWorkflowDetail, ProjectClosureWorkflowHistory, ProjectClosureWorkflowHistoryPaginationResponse } from "src/app/core/models/project-monitoring/project-closure-workflow";

class Store {
    @observable
    private _projectClosureWorkflowList;

    @observable
    loaded: boolean = false;

    @observable
    private _projectClosureWorkflowHistory;

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
    setWorkflowDetails(response: ProjectClosureWorkflowDetail) {
        this._projectClosureWorkflowList = response;
        this.loaded = true;
    }
    
    @computed
    get workflowDetails(): ProjectClosureWorkflowDetail[] {
        return this._projectClosureWorkflowList;
    }

    @action
    setWorkflowHistory(response: ProjectClosureWorkflowHistoryPaginationResponse) {
        this._projectClosureWorkflowHistory = response.data;
         this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        
        this.historyLoaded = true;
    }
    
    @computed
    get workflowHistoryDetails(): ProjectClosureWorkflowHistory {
        return this._projectClosureWorkflowHistory;
    }

}

export const ProjectClosureWorkflowStore = new Store();