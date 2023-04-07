import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { ProjectModule,ProjectModulePaginationResponse } from 'src/app/core/models/masters/project-management/project-module';

class Store {
    @observable
    private _projectModule: ProjectModule[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualProjectModule: ProjectModule;

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
    orderItem: string = 'project_module_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setProjectModule(response: ProjectModulePaginationResponse) {
        
        this._projectModule = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllProjectModule(projectModule: ProjectModule[]) {
       
        this._projectModule = projectModule;
        this.loaded = true;
        
    }

    @action
    setIndividualProjectModule(projectModule: ProjectModule) {
       
        this.individualProjectModule = projectModule;
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
    get allItems(): ProjectModule[] {
        return this._projectModule.slice();
    }


}

export const ProjectModuleMasterStore = new Store();