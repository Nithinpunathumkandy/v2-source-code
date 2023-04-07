import { observable, action, computed } from "mobx-angular";

import { FindingImpactAnalysisCategory,FindingImpactAnalysisCategoryPaginationResponse } from 'src/app/core/models/masters/internal-audit/finding-impact-analysis-category';


class Store {
    @observable
    private _findingImpactAnalysisCategoryList: FindingImpactAnalysisCategory[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'finding_impact_analysis_categories.created_at';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;

    searchText: string;
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setFindingImpactAnalysisCategory(response: FindingImpactAnalysisCategoryPaginationResponse) {
        
        this._findingImpactAnalysisCategoryList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllFindingImpactAnalysisCategory(audit: FindingImpactAnalysisCategory[]) {
       
        this._findingImpactAnalysisCategoryList = audit;
        this.loaded = true;
        
    }
    @computed
    get allItems(): FindingImpactAnalysisCategory[] {
        
        return this._findingImpactAnalysisCategoryList.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getFindingImpactAnalysisCategoryById(id: number): FindingImpactAnalysisCategory {
        return this._findingImpactAnalysisCategoryList.slice().find(e => e.id == id);
    }
  
}

export const FindingImpactAnalysisCategoryMasterStore = new Store();


