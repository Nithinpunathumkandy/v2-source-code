
import { observable, action, computed } from "mobx-angular";

import { Location ,LocationPaginationResponse } from 'src/app/core/models/masters/general/location';


class Store {
    @observable
    private _locations: Location[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'location_title';

    @observable
    location_select_form_modal:boolean = false;

    @observable
    selectedLocationList:Location[]=[];

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

    @observable
  saveSelected: boolean = false;

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
    setLocation(response: LocationPaginationResponse) {
        

        this._locations = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    addSelectedLocation(issues){
        this.selectedLocationList = issues;
    }

    @action
    setAllLocations(location: Location[]) {
       
        this._locations = location;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): Location[] {
        
        return this._locations.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getLocationById(id: number): Location {
        return this._locations.slice().find(e => e.id == id);
    }
  
}

export const LocationMasterStore = new Store();

