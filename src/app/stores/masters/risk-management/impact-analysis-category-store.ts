import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { ImpactCategory,ImpactCategoryPaginationResponse } from 'src/app/core/models/masters/risk-management/impact-category';

class Store {
    @observable
    private _impactCategory: ImpactCategory[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualImpactCategory: ImpactCategory;

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
    orderItem: string = 'risk_impact_analysis_categories.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setImpactCategory(response: ImpactCategoryPaginationResponse) {
        
        this._impactCategory = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllImpactCategory(impactCategory: ImpactCategory[]) {
       
        this._impactCategory = impactCategory;
        this.loaded = true;
        
    }

    @action
    setIndividualImpactCategory(impactCategory: ImpactCategory) {
       
        this.individualImpactCategory = impactCategory;
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
    get allItems(): ImpactCategory[] {
        return this._impactCategory.slice();
    }

    @action
    updateImpactCategory(type: ImpactCategory) {
        const types: ImpactCategory[] = this._impactCategory.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._impactCategory=types;
        }
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getImpactCategoryById(id: number): ImpactCategory {
        return this._impactCategory.slice().find(e => e.id == id);
    }

    get individualImpactCategoryId(){
        return this.individualImpactCategory;
    } 

}

export const ImpactCategoryMasterStore = new Store();