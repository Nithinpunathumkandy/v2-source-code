
import { observable, action, computed } from "mobx-angular";
import { ProjectSettingsIssueCategory, ProjectSettingsIssueCategoryPaginationResponse } from 'src/app/core/models/project-management/project-details/project-settings/project-setting-issue-category';

class Store {
    @observable
    private _CategoryTime: ProjectSettingsIssueCategory[] = [];


    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;


    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = '';

    @observable
    totalItems: number = null;


    @observable
    from: number = null;

    @observable
    last_page: number = null;


    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

   
    @action
    setIssueCategory(response: ProjectSettingsIssueCategoryPaginationResponse) {


        this._CategoryTime = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;

    }


    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }


    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    

    
    @computed
    get allItems(): ProjectSettingsIssueCategory[] {
        
        return this._CategoryTime.slice();
    }

  


}

export const ProjectSettingsCategoryTimeStore = new Store();

