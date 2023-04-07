import { observable, action, computed } from "mobx-angular";

import { RootCauseSubCategory,RootCauseSubCategoryPaginationResponse } from 'src/app/core/models/masters/internal-audit/root-cause-sub-categories';


class Store {
    @observable
    private _rootCauseSubCategoryList: RootCauseSubCategory[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'root_cause_sub_categories.created_at';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    
    @observable
    lastInsertedId: number = null;

    searchText: string;
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setRootCauseSubCategory(response: RootCauseSubCategoryPaginationResponse) {
        
        this._rootCauseSubCategoryList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllRootCauseSubCategory(audit: RootCauseSubCategory[]) {
       
        this._rootCauseSubCategoryList = audit;
        this.loaded = true;
        
    }
    @computed
    get allItems(): RootCauseSubCategory[] {
        
        return this._rootCauseSubCategoryList.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getRootCauseSubCategoryById(id: number): RootCauseSubCategory {
        return this._rootCauseSubCategoryList.slice().find(e => e.id == id);
    }
  
}

export const RootCauseSubCategoryMasterStore = new Store();


