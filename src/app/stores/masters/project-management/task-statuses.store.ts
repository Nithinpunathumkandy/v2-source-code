import { observable, action, computed } from "mobx-angular";
import { TaskStatuses, TaskStatusesPaginationResponse } from "src/app/core/models/masters/project-management/task-statuses";

class Store {
    @observable
    private _taskStatuses: TaskStatuses[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'task_statuses.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setTaskStatuses(response: TaskStatusesPaginationResponse) {        
        this._taskStatuses = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }


    @action
    setCurrentPage(currentPage: number) {
        this.currentPage = currentPage;
    }

    @action
    setOrderBy(orderBy: 'asc' | 'desc') {
        this.orderBy = orderBy;
    }

    @computed
    get allItems(): TaskStatuses[] {
        return this._taskStatuses.slice();
    }

}

export const TaskStatusesMasterStore = new Store();