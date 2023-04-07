import { observable, action, computed } from "mobx-angular";
import { ProjectCorrectiveActionStatus, ProjectCorrectiveActionStatusPaginationResponse } from "src/app/core/models/masters/project-monitoring/project-corrective-action-status";

class Store {
    @observable
    private _projectCorrectiveActionStatus: ProjectCorrectiveActionStatus[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'project_monitor_corrective_action_status.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    searchText: string;

    @action
    setProjectCorrectiveActionStatus(response: ProjectCorrectiveActionStatusPaginationResponse) {        
        this._projectCorrectiveActionStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllProjectCorrectiveActionStatus(ProjectCorrectiveActionStatus: ProjectCorrectiveActionStatus[]) {
        this._projectCorrectiveActionStatus = ProjectCorrectiveActionStatus;
        this.loaded = true;
    }

    @action
    updateProjectCorrectiveActionStatus(type: ProjectCorrectiveActionStatus) {
        const types: ProjectCorrectiveActionStatus[] = this._projectCorrectiveActionStatus.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._projectCorrectiveActionStatus = types;
        }
    }

    @action
    getProjectCorrectiveActionStatusById(id: number): ProjectCorrectiveActionStatus {
        return this._projectCorrectiveActionStatus.slice().find(e => e.id == id);
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
    get allItems(): ProjectCorrectiveActionStatus[] {
        return this._projectCorrectiveActionStatus.slice();
    }

}

export const ProjectCorrectiveActionStatusMasterStore = new Store();