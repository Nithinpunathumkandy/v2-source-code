import { observable, action, computed } from "mobx-angular";

import { Currency,CurrencyPaginationResponse } from 'src/app/core/models/masters/general/currency';


class Store {
    @observable
    private _currency: Currency[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualCurrency: Currency;

    @observable
    individualLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    lastInsertedId: number = null;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    searchText: string;

    @observable
    lastTitle:string="";

    @action
    setCurrency(response: CurrencyPaginationResponse) {
        
        this._currency = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllCurrency(currency: Currency[]) {
       
        this._currency = currency;
        this.loaded = true;
        
    }

    @action
    setIndividualCurrency(currency: Currency) {
       
        this.individualCurrency = currency;
        this.individualLoaded = true;
        
    }

    

    @action
    setCurrentPage(currentPage: number) {
        this.currentPage = currentPage;
    }

    @action
    setOrderBy(orderBy: 'asc' | 'desc') {
        this.orderBy = orderBy;
    }



    @computed
    get allItems(): Currency[] {
        return this._currency.slice();
    }

    getCurrencyById(id: number):Currency{
        return this._currency.slice().find(e => e.id == id);
    }
    

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
        // this.lastTitle= title;
    }


    get individualCurrencyId(){
        return this.individualCurrency;
    } 

}
export const CurrencyMasterStore = new Store();