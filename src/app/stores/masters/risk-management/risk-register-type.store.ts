import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { RiskRegisterTypes, RiskRegisterTypesByLanguage, RiskRegisterTypesPaginationResponse } from "src/app/core/models/masters/risk-management/risk-register-type";

class Store {
    @observable
    private _riskRegisterTypes: RiskRegisterTypes[] = [];

    @observable
    private _allRiskRegisterTypes: RiskRegisterTypesByLanguage[] = [];

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
    orderItem: string = 'rist_register_types.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setRiskRegisterTypes(response: RiskRegisterTypesPaginationResponse) {
        
        this._riskRegisterTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllRiskRegisterTypes(response: RiskRegisterTypesByLanguage[]) {
        
        this._allRiskRegisterTypes = response;
        this.allLoaded = true;
    }

    // @action
    // setAllRiskRegisterTypes(riskRegisterTypes: RiskRegisterTypes[]) {
       
    //     this._riskRegisterTypes = riskRegisterTypes;
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
    get allItems(): RiskRegisterTypes[] {
        return this._riskRegisterTypes.slice();
    }

    @computed
    get allLanguageRiskRegisterTypes(){
        return this._allRiskRegisterTypes.slice();
    }


}

export const RiskRegisterTypesMasterStore = new Store();