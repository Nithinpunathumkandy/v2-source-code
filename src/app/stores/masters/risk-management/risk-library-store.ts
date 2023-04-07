import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { RiskLibrary,RiskLibraryPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-library';

class Store {
    @observable
    private _riskLibrary: RiskLibrary[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualRiskLibrary: RiskLibrary;

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
    orderItem: string = 'risk_library.created_at';

    @observable
    risk_library_form_modal:boolean = false;

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setRiskLibrary(response: RiskLibraryPaginationResponse) {
        
        this._riskLibrary = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllRiskLibrary(risklibrary: RiskLibrary[]) {
       
        this._riskLibrary = risklibrary;
        this.loaded = true;
        
    }

    @action
    setIndividualRiskLibrary(riskLibrary: RiskLibrary) {
       
        this.individualRiskLibrary = riskLibrary;
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
    get allItems(): RiskLibrary[] {
        return this._riskLibrary.slice();
    }

    @action
    updateRiskLibrary(type: RiskLibrary) {
        const types: RiskLibrary[] = this._riskLibrary.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._riskLibrary=types;
        }
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getRiskLibraryById(id: number): RiskLibrary {
        return this._riskLibrary.slice().find(e => e.id == id);
    }

    get individualRiskLibraryId(){
        return this.individualRiskLibrary;
    } 

}

export const RiskLibraryMasterStore = new Store();