import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { ProjectTimeCategory,ProjectTimeCategoryPaginationResponse } from 'src/app/core/models/masters/project-management/project-time-category';

class Store {
    @observable
    private _projectTimeCategory: ProjectTimeCategory[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualProjectTimeCategory: ProjectTimeCategory;

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
    orderItem: string = 'project_time_categories.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setProjectTimeCategory(response: ProjectTimeCategoryPaginationResponse) {
        
        this._projectTimeCategory = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllProjectTimeCategory(projectTimeCategory: ProjectTimeCategory[]) {
       
        this._projectTimeCategory = projectTimeCategory;
        this.loaded = true;
        
    }

    @action
    setIndividualProjectTimeCategory(projectTimeCategory: ProjectTimeCategory) {
       
        this.individualProjectTimeCategory = projectTimeCategory;
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
    get allItems(): ProjectTimeCategory[] {
        return this._projectTimeCategory.slice();
    }

    

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    

    get individualProjectTimeCategoryId(){
        return this.individualProjectTimeCategory;
    } 


      //copied - assign types for all below fns
    
      @observable
      _selectedTaskCategoryAll = [];
  
      @action
      deleteTaskCategoryById(id: number) {
          
          const index = this._selectedTaskCategoryAll.findIndex(e => e.id === id); 
          return this._selectedTaskCategoryAll.splice(index, 1); 
          
      }
  
      @computed
      get selectedAllItems() {
          return this._selectedTaskCategoryAll.slice();
      }
  
      @action
      addSelecteIssueCategory(issues){
          this._selectedTaskCategoryAll = issues;
      }

}

export const ProjectTimeCategoryMasterStore = new Store();