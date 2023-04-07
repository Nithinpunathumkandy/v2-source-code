import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { ProjectStatus,ProjectStatusPaginationResponse } from 'src/app/core/models/masters/project-management/project-status';

class Store {
    @observable
    private _projectStatus: ProjectStatus[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualProjectStatus: ProjectStatus;

    @observable
    individualLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    lastInsertedId: number = null;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'project_status_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setProjectStatus(response: ProjectStatusPaginationResponse) {
        
        this._projectStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllProjectStatus(projectStatus: ProjectStatus[]) {
       
        this._projectStatus = projectStatus;
        this.loaded = true;
        
    }

    @action
    setIndividualProjectStatus(projectStatus: ProjectStatus) {
       
        this.individualProjectStatus = projectStatus;
        this.individualLoaded = true;
        
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
    get allItems(): ProjectStatus[] {
        return this._projectStatus.slice();
    }

    get individualProjectStatusId(){
        return this.individualProjectStatus;
    } 

}

export const ProjectStatusMasterStore = new Store();