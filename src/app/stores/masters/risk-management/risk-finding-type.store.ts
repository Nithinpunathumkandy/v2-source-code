import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { RiskFindingTypes, RiskFindingTypesByLanguage, RiskFindingTypesPaginationResponse } from "src/app/core/models/masters/risk-management/risk-finding-type";

class Store {
    @observable
    private _riskFindingTypes: RiskFindingTypes[] = [];

    @observable
    private _allRiskFindingTypes: RiskFindingTypesByLanguage[] = [];

    @observable
    loaded: boolean = false;

    
    @observable
    allLoaded: boolean = false;

    @observable
    individualLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'rist_finding_types.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setRiskFindingTypes(response: RiskFindingTypesPaginationResponse) {
        
        this._riskFindingTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllRiskFindingTypes(response: RiskFindingTypesByLanguage[]) {
        
        this._allRiskFindingTypes = response;
        this.allLoaded = true;
    }

    // @action
    // setAllRiskFindingTypes(riskFindingTypes: RiskFindingTypes[]) {
       
    //     this._riskFindingTypes = riskFindingTypes;
    //     this.loaded = true;
        
    // }

    @action
    setCurrentPage(currentPage: number) {
        this.currentPage = currentPage;
    }

    @action
    setOrderBy(orderBy: 'asc' | 'desc') {
        this.orderBy = orderBy;
    }



    @computed
    get allItems(): RiskFindingTypes[] {
        return this._riskFindingTypes.slice();
    }

    @computed
    get allLanguageRiskFindingTypes(){
        return this._allRiskFindingTypes.slice();
    }


}

export const RiskFindingTypesMasterStore = new Store();