import { observable, action, computed } from "mobx-angular";
import { ProjectWorkflowDetail, ProjectWorkflowHistory, ProjectWorkflowHistoryPaginationResponse } from "src/app/core/models/project-monitoring/project-workflow-modal";

class Store {
    @observable
    private _projectWorkflowList;

    @observable
    loaded: boolean = false;

    @observable
    private _projectWorkflowHistory;

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
    setWorkflowDetails(response: ProjectWorkflowDetail) {
        this._projectWorkflowList = response;
        this.loaded = true;
    }
    @computed
    get workflowDetails(): ProjectWorkflowDetail[] {
        return this._projectWorkflowList;
    }

    @action
    setWorkflowHistory(response: ProjectWorkflowHistoryPaginationResponse) {
        this._projectWorkflowHistory = response.data;
         this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        
        this.historyLoaded = true;
    }
    
    @computed
    get workflowHistoryDetails(): ProjectWorkflowHistory {
        return this._projectWorkflowHistory;
    }
}
export const ProjectWorkflowStore = new Store();