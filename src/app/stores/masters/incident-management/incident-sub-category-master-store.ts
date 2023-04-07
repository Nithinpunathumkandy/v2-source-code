
import { observable, action, computed } from "mobx-angular";

import { IncidentSubCategory,IncidentSubCategoryPaginationResponse } from 'src/app/core/models/masters/incident-management/incident-sub-category';


class Store {
    @observable
    private _incidentSubCategory: IncidentSubCategory[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;z

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'incident_sub_category.created_at';

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
    setIncidentSubCategory(response: IncidentSubCategoryPaginationResponse) {
        

        this._incidentSubCategory = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllIncidentSubCategory(incidentSubCategory: IncidentSubCategory[]) {
       
        this._incidentSubCategory = incidentSubCategory;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): IncidentSubCategory[] {
        
        return this._incidentSubCategory.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    unsetIncidentSubCategory(){
        this._incidentSubCategory = [];
        this.loaded = false;
    }

    @action
    getIncidentSubCategoryById(id: number): IncidentSubCategory {
        return this._incidentSubCategory.slice().find(e => e.id == id);
    }
  
}

export const IncidentSubCategoryMasterStore = new Store();

