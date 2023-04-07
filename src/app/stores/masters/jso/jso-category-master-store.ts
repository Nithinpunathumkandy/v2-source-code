
import { observable, action, computed } from "mobx-angular";

import { JsoCategory,JsoCategoryPaginationResponse } from 'src/app/core/models/masters/jso/jso-category';


class Store {
    @observable
    private _jsoCategory: JsoCategory[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'jso_category.created_at';

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
    setJsoCategory(response: JsoCategoryPaginationResponse) {
        

        this._jsoCategory = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllJsoCategory(jsoCategory: JsoCategory[]) {
       
        this._jsoCategory = jsoCategory;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): JsoCategory[] {
        
        return this._jsoCategory.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getJsoCategoryById(id: number): JsoCategory {
        return this._jsoCategory.slice().find(e => e.id == id);
    }
  
}

export const JsoCategoryMasterStore = new Store();

