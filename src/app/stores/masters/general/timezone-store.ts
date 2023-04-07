
import { observable, action, computed } from "mobx-angular";

import { Timezone ,TimezonePaginationResponse } from 'src/app/core/models/masters/general/timezone';


class Store {
    @observable
    private _timezones: Timezone[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'timezone_title';

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
    setTimeZone(response: TimezonePaginationResponse) {
        

        this._timezones = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllTimeZones(timezone: Timezone[]) {
       
        this._timezones = timezone;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): Timezone[] {
        
        return this._timezones.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getTimeZoneById(id: number): Timezone {
        return this._timezones.slice().find(e => e.id == id);
    }
  
}

export const TimezoneMasterStore = new Store();

