import { observable, action, computed } from "mobx-angular";
import { ProjectClosureStatus, ProjectClosureStatusPaginationResponse } from "src/app/core/models/masters/project-monitoring/project-closure-status";

class Store {
    @observable
    private _projectClosureStatus: ProjectClosureStatus[] = [];

    @observable
    lessonLearnedList = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'project_monitor_closure_statuses.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    searchText: string;

    @action
    setProjectClosureStatus(response: ProjectClosureStatusPaginationResponse) {        
        this._projectClosureStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllProjectClosureStatus(ProjectClosureStatus: ProjectClosureStatus[]) {
        this._projectClosureStatus = ProjectClosureStatus;
        this.loaded = true;
    }

    @action
    updateProjectClosureStatus(type: ProjectClosureStatus) {
        const types: ProjectClosureStatus[] = this._projectClosureStatus.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._projectClosureStatus = types;
        }
    }

    @action
    getProjectClosureStatusById(id: number): ProjectClosureStatus {
        return this._projectClosureStatus.slice().find(e => e.id == id);
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
    get allItems(): ProjectClosureStatus[] {
        return this._projectClosureStatus.slice();
    }

}

export const ProjectClosureStatusMasterStore = new Store();