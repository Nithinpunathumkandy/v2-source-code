
import { observable, action, computed } from "mobx-angular";

import { Industry ,IndustryPaginationResponse } from 'src/app/core/models/masters/general/industry';


class Store {
    @observable
    private _industries: Industry[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'industry_title';

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
    setIndustry(response: IndustryPaginationResponse) {
        

        this._industries = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllIndustries(industry: Industry[]) {
       
        this._industries = industry;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): Industry[] {
        
        return this._industries.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getIndustryById(id: number): Industry {
        return this._industries.slice().find(e => e.id == id);
    }
  
}

export const IndustryMasterStore = new Store();

