
import { observable, action, computed } from "mobx-angular";

import { IncidentCategories,IncidentCategoriesPaginationResponse } from 'src/app/core/models/masters/incident-management/incident-categories';


class Store {
    @observable
    private _incidentCategories: IncidentCategories[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;z

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'incident_categories.created_at';

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
    setIncidentCategories(response: IncidentCategoriesPaginationResponse) {
        

        this._incidentCategories = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllIncidentCategories(incidentCategories: IncidentCategories[]) {
       
        this._incidentCategories = incidentCategories;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): IncidentCategories[] {
        
        return this._incidentCategories.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getIncidentCategoriesById(id: number): IncidentCategories {
        return this._incidentCategories.slice().find(e => e.id == id);
    }
  
}

export const IncidentCategoriesMasterStore = new Store();

