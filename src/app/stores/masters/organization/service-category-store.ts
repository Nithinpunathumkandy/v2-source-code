
import { observable, action, computed } from "mobx-angular";

import { ServiceCategory,ServiceCategoryPaginationResponse } from 'src/app/core/models/masters/organization/service-category';


class Store {
    @observable
    private _serviceCategories: ServiceCategory[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'service_categories.created_at';

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
    setServiceCategory(response: ServiceCategoryPaginationResponse) {
        

        this._serviceCategories = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllServiceCategory(ServiceCategory: ServiceCategory[]) {
       
        this._serviceCategories = ServiceCategory;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): ServiceCategory[] {
        
        return this._serviceCategories.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getServiceCategoryById(id: number): ServiceCategory {
        return this._serviceCategories.slice().find(e => e.id == id);
    }
  
}

export const ServiceCategoryMasterStore = new Store();

