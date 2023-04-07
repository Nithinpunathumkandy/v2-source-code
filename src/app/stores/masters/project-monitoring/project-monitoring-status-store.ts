import { observable, action, computed } from "mobx-angular";
import { ProjectMonitoringStatus, ProjectMonitoringStatusPaginationResponse } from "src/app/core/models/masters/project-monitoring/project-monitoring-status";

class Store {
    @observable
    private _projectMonitoringStatus: ProjectMonitoringStatus[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'project_monitoring_status_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    searchText: string;

    @action
    setProjectMonitoringStatus(response: ProjectMonitoringStatusPaginationResponse) {        
        this._projectMonitoringStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllProjectMonitoringStatus(ProjectMonitoringStatus: ProjectMonitoringStatus[]) {
        this._projectMonitoringStatus = ProjectMonitoringStatus;
        this.loaded = true;
    }

    @action
    updateProjectMonitoringStatus(type: ProjectMonitoringStatus) {
        const types: ProjectMonitoringStatus[] = this._projectMonitoringStatus.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._projectMonitoringStatus = types;
        }
    }

    @action
    getProjectMonitoringStatusById(id: number): ProjectMonitoringStatus {
        return this._projectMonitoringStatus.slice().find(e => e.id == id);
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
    get allItems(): ProjectMonitoringStatus[] {
        return this._projectMonitoringStatus.slice();
    }

}

export const ProjectMonitoringStatusMasterStore = new Store();