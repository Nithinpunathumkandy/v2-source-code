import { observable, action, computed } from "mobx-angular";
import { IndividualRiskSubCategory, RiskSubCategory, RiskSubCategoryPaginationResponse } from "src/app/core/models/masters/risk-management/risk-sub-category";

class Store {
    @observable
    private _riskSubCategory: RiskSubCategory[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualRiskSubCategory: IndividualRiskSubCategory;

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
    orderItem: string = 'risk_sub_categories.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setRiskSubCategory(response: RiskSubCategoryPaginationResponse) {
        
        this._riskSubCategory = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllRiskSubCategory(riskSubCategory: RiskSubCategory[]) {
       
        this._riskSubCategory = riskSubCategory;
        this.loaded = true;
        
    }

    @action
    setIndividualRiskSubCategory(riskSubCategory: IndividualRiskSubCategory) {
       
        this.individualRiskSubCategory = riskSubCategory;
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
    get allItems(): RiskSubCategory[] {
        return this._riskSubCategory.slice();
    }

    @action
    updateRiskSubCategory(type: RiskSubCategory) {
        const types: RiskSubCategory[] = this._riskSubCategory.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._riskSubCategory=types;
        }
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getRiskSubCategoryById(id: number): RiskSubCategory {
        return this._riskSubCategory.slice().find(e => e.id == id);
    }

    get individualRiskSubCategoryId(){
        return this.individualRiskSubCategory;
    } 

}

export const RiskSubCategoryMasterStore = new Store();