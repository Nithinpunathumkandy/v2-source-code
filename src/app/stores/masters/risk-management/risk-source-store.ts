import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { RiskSource,RiskSourcePaginationResponse } from 'src/app/core/models/masters/risk-management/risk-source';

class Store {
    @observable
    private _riskSource: RiskSource[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualRiskSource: RiskSource;

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
    orderItem: string = 'risk_sources.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setRiskSource(response: RiskSourcePaginationResponse) {
        
        this._riskSource = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllRiskSource(risksource: RiskSource[]) {
       
        this._riskSource = risksource;
        this.loaded = true;
        
    }

    @action
    setIndividualRiskSource(riskSource: RiskSource) {
       
        this.individualRiskSource = riskSource;
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
    get allItems(): RiskSource[] {
        return this._riskSource.slice();
    }

    @action
    updateRiskSource(type: RiskSource) {
        const types: RiskSource[] = this._riskSource.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._riskSource=types;
        }
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getRiskSourceById(id: number): RiskSource {
        return this._riskSource.slice().find(e => e.id == id);
    }

    get individualRiskSourceId(){
        return this.individualRiskSource;
    } 

}

export const RiskSourceMasterStore = new Store();