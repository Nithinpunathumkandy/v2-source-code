
import { observable, action, computed } from "mobx-angular";

import { KRI, KRIPaginationResponse } from 'src/app/core/models/risk-management/risks/key-risk-indicators';



class Store {
    @observable
    private _kri: KRI[] = [];

    @observable
    private _individualKri: KRI;

    @observable
    private _individualKriLoaded: boolean = false;

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
    setKRI(response: KRIPaginationResponse) {


        this._kri = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;

    }

    @action
    setAllKRI(kri: KRI[]) {

        this._kri = kri;
        this.loaded = true;

    }

    @action
    setIndividualKRI(kri: KRI) {
        this._individualKri = kri;
        this._individualKriLoaded = true;
    }

    @computed
    get allItems(): KRI[] {

        return this._kri.slice();
    }
    @action
    setLastInsertedId(id: number) {
        this.lastInsertedId = id;
    }

    @action
    getKRIById(id: number): KRI {
        return this._kri.slice().find(e => e.id == id);
    }

    @action
    unsetKRI(){
        this._kri=[];
        this.loaded=false;
    }

}

export const IsmsKRIStore = new Store();

