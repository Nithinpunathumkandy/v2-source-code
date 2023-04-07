import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { ProjectCategory,ProjectCategoryPaginationResponse } from 'src/app/core/models/masters/project-management/project-category';

class Store {
    @observable
    private _projectCategory: ProjectCategory[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualProjectCategory: ProjectCategory;

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
    orderItem: string = 'project_categories.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setProjectCategory(response: ProjectCategoryPaginationResponse) {
        
        this._projectCategory = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllProjectCategory(projectCategory: ProjectCategory[]) {
       
        this._projectCategory = projectCategory;
        this.loaded = true;
        
    }

    @action
    setIndividualProjectCategory(projectCategory: ProjectCategory) {
       
        this.individualProjectCategory = projectCategory;
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
    get allItems(): ProjectCategory[] {
        return this._projectCategory.slice();
    }

    

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    

    get individualProjectCategoryId(){
        return this.individualProjectCategory;
    } 

}

export const ProjectCategoryMasterStore = new Store();