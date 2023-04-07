import { observable, action, computed } from "mobx-angular";
import { KeyRisk , KeyRiskPaginationResponse } from 'src/app/core/models/masters/risk-management/key-risk-indicators';

class Store{

    @observable
    private _keyRisk: KeyRisk[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualKeyRisk: KeyRisk;

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
    orderItem: string = 'key_risk_indicators.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setKeyRisk(response: KeyRiskPaginationResponse) {
        
        this._keyRisk = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllKeyRisk(risksource: KeyRisk[]) {
       
        this._keyRisk = risksource;
        this.loaded = true;
        
    }

    @action
    setIndividualKeyRisk(riskSource: KeyRisk) {
       
        this.individualKeyRisk = riskSource;
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
    get allItems(): KeyRisk[] {
        return this._keyRisk.slice();
    }

    @action
    updateRiskSource(type: KeyRisk) {
        const types: KeyRisk[] = this._keyRisk.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._keyRisk=types;
        }
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getKeyRiskById(id: number): KeyRisk {
        return this._keyRisk.slice().find(e => e.id == id);
    }

    get individualKeyRiskId(){
        return this.individualKeyRisk;
    } 
}
export const KeyRiskIndicatorsMasterStore = new Store();