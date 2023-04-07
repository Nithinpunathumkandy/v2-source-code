import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { RiskCategory,RiskCategoryPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-category';

class Store {
    @observable
    private _riskCategory: RiskCategory[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualRiskCategory: RiskCategory;

    @observable
    individualLoaded: boolean = false;

    @observable
    lastInsertedId: number = null;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'risk_categories.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setRiskCategory(response: RiskCategoryPaginationResponse) {
        
        this._riskCategory = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllRiskCategory(riskCategory: RiskCategory[]) {
       
        this._riskCategory = riskCategory;
        this.loaded = true;
        
    }

    @action
    setIndividualRiskCategory(riskCategory: RiskCategory) {
       
        this.individualRiskCategory = riskCategory;
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
    get allItems(): RiskCategory[] {
        return this._riskCategory.slice();
    }

    @action
    updateRiskCategory(type: RiskCategory) {
        const types: RiskCategory[] = this._riskCategory.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._riskCategory=types;
        }
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getRiskCategoryById(id: number): RiskCategory {
        return this._riskCategory.slice().find(e => e.id == id);
    }

    get individualRiskCategoryId(){
        return this.individualRiskCategory;
    } 

}

export const RiskCategoryMasterStore = new Store();