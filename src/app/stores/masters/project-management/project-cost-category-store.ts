import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { ProjectCostCategory,ProjectCostCategoryPaginationResponse } from 'src/app/core/models/masters/project-management/project-cost-category';

class Store {
    @observable
    private _projectCostCategory: ProjectCostCategory[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualProjectCostCategory: ProjectCostCategory;

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
    orderItem: string = 'project_cost_categories.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setProjectCostCategory(response: ProjectCostCategoryPaginationResponse) {
        
        this._projectCostCategory = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllProjectCostCategory(projectCostCategory: ProjectCostCategory[]) {
       
        this._projectCostCategory = projectCostCategory;
        this.loaded = true;
        
    }

    @action
    setIndividualProjectCostCategory(projectCostCategory: ProjectCostCategory) {
       
        this.individualProjectCostCategory = projectCostCategory;
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
    get allItems(): ProjectCostCategory[] {
        return this._projectCostCategory.slice();
    }

    

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    

    get individualProjectCostCategoryId(){
        return this.individualProjectCostCategory;
    } 

}

export const ProjectCostCategoryMasterStore = new Store();