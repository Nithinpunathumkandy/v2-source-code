
import { observable, action, computed } from "mobx-angular";

import { JsoSubCategory,JsoSubCategoryPaginationResponse } from 'src/app/core/models/masters/jso/jso-sub-category';


class Store {
    @observable
    private _jsoSubCategory: JsoSubCategory[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'jso_sub_category.created_at';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

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
    setJsoSubCategory(response: JsoSubCategoryPaginationResponse) {
        

        this._jsoSubCategory = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;

    }

    @action
    setAllJsoSubCategory(jsoSubCategory: JsoSubCategory[]) {
       
        this._jsoSubCategory = jsoSubCategory;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): JsoSubCategory[] {
        
        return this._jsoSubCategory.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getJsoSubCategoryById(id: number): JsoSubCategory {
        return this._jsoSubCategory.slice().find(e => e.id == id);
    }
  
}

export const JsoSubCategoryMasterStore = new Store();

