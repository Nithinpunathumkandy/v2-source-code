import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { RiskArea,RiskAreaPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-area';

class Store {
    @observable
    private _riskArea: RiskArea[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualRiskArea: RiskArea;

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
    orderItem: string = 'risk_areas.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setRiskArea(response: RiskAreaPaginationResponse) {
        
        this._riskArea = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllRiskArea(riskarea: RiskArea[]) {
       
        this._riskArea = riskarea;
        this.loaded = true;
        
    }

    @action
    setIndividualRiskArea(riskArea: RiskArea) {
       
        this.individualRiskArea = riskArea;
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
    get allItems(): RiskArea[] {
        return this._riskArea.slice();
    }

    @action
    updateRiskArea(type: RiskArea) {
        const types: RiskArea[] = this._riskArea.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._riskArea=types;
        }
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getRiskAreaById(id: number): RiskArea {
        return this._riskArea.slice().find(e => e.id == id);
    }

    get individualRiskAreaId(){
        return this.individualRiskArea;
    } 

}

export const RiskAreaMasterStore = new Store();