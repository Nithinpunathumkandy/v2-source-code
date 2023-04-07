import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { ProjectType,ProjectTypePaginationResponse } from 'src/app/core/models/masters/project-management/project-type';

class Store {
    @observable
    private _projectType: ProjectType[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualProjectType: ProjectType;

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
    orderItem: string = 'project_type_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setProjectType(response: ProjectTypePaginationResponse) {
        
        this._projectType = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllProjectType(projectType: ProjectType[]) {
       
        this._projectType = projectType;
        this.loaded = true;
        
    }

    @action
    setIndividualProjectType(projectType: ProjectType) {
       
        this.individualProjectType = projectType;
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
    get allItems(): ProjectType[] {
        return this._projectType.slice();
    }

    

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    

    get individualProjectTypeId(){
        return this.individualProjectType;
    } 

}

export const ProjectTypeMasterStore = new Store();