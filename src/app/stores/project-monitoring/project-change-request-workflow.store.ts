import { observable, action, computed } from "mobx-angular";
import { ProjectChangeRequestWorkflowDetail, ProjectChangeRequestWorkflowHistory, ProjectWorkflowChangeRequestHistoryPaginationResponse } from "src/app/core/models/project-monitoring/project-change-request-workfloww";

class Store {
    @observable
    private _projectChangeRequestWorkflowList;

    @observable
    loaded: boolean = false;

    @observable
    private _projectChangeRequestWorkflowHistory;

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
    setWorkflowDetails(response: ProjectChangeRequestWorkflowDetail) {
        this._projectChangeRequestWorkflowList = response;
        this.loaded = true;
    }
    @computed
    get workflowDetails(): ProjectChangeRequestWorkflowDetail[] {
        return this._projectChangeRequestWorkflowList;
    }

    @action
    setWorkflowHistory(response: ProjectWorkflowChangeRequestHistoryPaginationResponse) {
        this._projectChangeRequestWorkflowHistory = response.data;
         this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        
        this.historyLoaded = true;
    }
    
    @computed
    get workflowHistoryDetails(): ProjectChangeRequestWorkflowHistory {
        return this._projectChangeRequestWorkflowHistory;
    }
}
export const ProjectChangeRequestWorkflowStore = new Store();