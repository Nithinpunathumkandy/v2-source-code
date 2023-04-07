
import { observable, action, computed } from "mobx-angular";

import { IndustryCategory,IndustryCategoryPaginationResponse } from 'src/app/core/models/masters/general/industry-category';


class Store {
    @observable
    private _industryCategories: IndustryCategory[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'industry_category_title';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

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
    setIndustryCategory(response: IndustryCategoryPaginationResponse) {
        

        this._industryCategories = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllIndustryCategories(industryCategory: IndustryCategory[]) {
       
        this._industryCategories = industryCategory;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): IndustryCategory[] {
        
        return this._industryCategories.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getIndustryCategoryById(id: number): IndustryCategory {
        return this._industryCategories.slice().find(e => e.id == id);
    }
  
}

export const IndustryCategoryMasterStore = new Store();

