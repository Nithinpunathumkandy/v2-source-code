
import { observable, action, computed } from "mobx-angular";

import { Region,RegionPaginationResponse } from 'src/app/core/models/masters/general/region';


class Store {
    @observable
    private _regions: Region[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'region_title';

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
    setRegion(response: RegionPaginationResponse) {
        

        this._regions = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllRegions(region: Region[]) {
       
        this._regions = region;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): Region[] {
        
        return this._regions.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getRegionById(id: number): Region {
        return this._regions.slice().find(e => e.id == id);
    }
  
}

export const RegionMasterStore = new Store();

