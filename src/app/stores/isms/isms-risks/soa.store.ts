
import { observable, action, computed } from "mobx-angular";

import { SOA, SOAPaginationResponse } from 'src/app/core/models/isms/soa';



class Store {
    @observable
    private _soa: SOA[] = [];

    @observable
    private _individualSoa: SOA;

    @observable
    individualSoaLoaded: boolean = false;

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;


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
    searchText: string;

    @observable
    orderItem = 'risk_key_risk_indicators.id';

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setSOA(response: SOAPaginationResponse) {


        this._soa = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;

    }

    @action
    setAllSOA(soa: SOA[]) {

        this._soa = soa;
        this.loaded = true;

    }

    @action
    setIndividualSOA(soa: SOA) {
        this._individualSoa = soa;
        this.individualSoaLoaded = true;
    }

    @action
    unsetsetIndividualSOA() {
        this._individualSoa = null;
        this.individualSoaLoaded = false;
    }

    @computed
    get allItems(): SOA[] {

        return this._soa.slice();
    }


    @computed
    get individualSoa(){
        return this._individualSoa;
    } 

    @action
    setLastInsertedId(id: number) {
        this.lastInsertedId = id;
    }

    @action
    getSOAById(id: number): SOA {
        return this._soa.slice().find(e => e.id == id);
    }

    @action
    unsetSOA(){
        this._soa=[];
        this.loaded=false;
    }

}

export const SOAStore = new Store();

