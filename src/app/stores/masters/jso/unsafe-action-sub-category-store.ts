
import { observable, action, computed } from "mobx-angular";

import { UnsafeActionSubCategory,UnsafeActionSubCategoryPaginationResponse } from 'src/app/core/models/masters/jso/unsafe-action-sub-category';


class Store {
    @observable
    private _unsafeActionSubCategory: UnsafeActionSubCategory[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'jso_unsafe_action_sub_category.created_at';

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
    setUnsafeActionSubCategory(response: UnsafeActionSubCategoryPaginationResponse) {
        

        this._unsafeActionSubCategory = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;

    }

    @action
    setAllUnsafeActionSubCategory(UnsafeActionSubCategory: UnsafeActionSubCategory[]) {
       
        this._unsafeActionSubCategory = UnsafeActionSubCategory;
        this.loaded = true;
        
    }

    @action
    unsetUnsafeActionSubCategory() {
       
        this._unsafeActionSubCategory = [];
        this.loaded = false;
        this.currentPage = 1;
        this.itemsPerPage = null;
        this.totalItems = null;
        this.from = null;
    }
    
    @computed
    get allItems(): UnsafeActionSubCategory[] {
        
        return this._unsafeActionSubCategory.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getUnsafeActionSubCategoryById(id: number): UnsafeActionSubCategory {
        return this._unsafeActionSubCategory.slice().find(e => e.id == id);
    }
  
}

export const UnsafeActionSubCategoryMasterStore = new Store();

