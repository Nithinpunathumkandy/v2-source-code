
import { observable, action, computed } from "mobx-angular";

import { Country,CountryPaginationResponse } from 'src/app/core/models/masters/general/country';


class Store {
    @observable
    private _countries: Country[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'country_title';

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
    setCountry(response: CountryPaginationResponse) {
        

        this._countries = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllCountries(country: Country[]) {
       
        this._countries = country;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): Country[] {
        
        return this._countries.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getCountryById(id: number): Country {
        return this._countries.slice().find(e => e.id == id);
    }
  
}

export const CountryMasterStore = new Store();

