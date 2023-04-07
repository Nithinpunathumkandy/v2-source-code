import { observable, action, computed } from "mobx-angular";
import { ProjectChangeRequestStatus, ProjectChangeRequestStatusPaginationResponse } from "src/app/core/models/masters/project-monitoring/project-change-request-status";

class Store {
    @observable
    private _projectChangeRequestStatus: ProjectChangeRequestStatus[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'project_monitor_change_request_statuses.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    searchText: string;

    @action
    setProjectChangeRequestStatus(response: ProjectChangeRequestStatusPaginationResponse) {        
        this._projectChangeRequestStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllProjectChangeRequestStatus(ProjectChangeRequestStatus: ProjectChangeRequestStatus[]) {
        this._projectChangeRequestStatus = ProjectChangeRequestStatus;
        this.loaded = true;
    }

    @action
    updateProjectChangeRequestStatus(type: ProjectChangeRequestStatus) {
        const types: ProjectChangeRequestStatus[] = this._projectChangeRequestStatus.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._projectChangeRequestStatus = types;
        }
    }

    @action
    getProjectChangeRequestStatusById(id: number): ProjectChangeRequestStatus {
        return this._projectChangeRequestStatus.slice().find(e => e.id == id);
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
    get allItems(): ProjectChangeRequestStatus[] {
        return this._projectChangeRequestStatus.slice();
    }

}

export const ProjectChangeRequestStatusMasterStore = new Store();