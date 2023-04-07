
import { observable, action, computed } from "mobx-angular";

import { UnsafeActionCategory,UnsafeActionCategoryPaginationResponse } from 'src/app/core/models/masters/jso/unsafe-action-category';


class Store {
    @observable
    private _unsafeActionCategory: UnsafeActionCategory[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'jso_unsafe_action_category.created_at';

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
    setUnsafeActionCategory(response: UnsafeActionCategoryPaginationResponse) {
        

        this._unsafeActionCategory = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;

    }

    @action
    setAllUnsafeActionCategory(UnsafeActionCategory: UnsafeActionCategory[]) {
       
        this._unsafeActionCategory = UnsafeActionCategory;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): UnsafeActionCategory[] {
        
        return this._unsafeActionCategory.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getUnsafeActionCategoryById(id: number): UnsafeActionCategory {
        return this._unsafeActionCategory.slice().find(e => e.id == id);
    }
  
}

export const UnsafeActionCategoryMasterStore = new Store();

