import { observable, action, computed } from "mobx-angular";
import { BusinessImpactAnalysisStatuses, BusinessImpactAnalysisStatusesPaginationResponse } from "src/app/core/models/masters/bcm/business-impact-analysis-statuses";

class Store {
    @observable
    private _biaStatuses: BusinessImpactAnalysisStatuses[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'business_impact_analysis_statuses_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setBusinessImpactAnalysisStatuses(response: BusinessImpactAnalysisStatusesPaginationResponse) {        
        this._biaStatuses = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllBusinessImpactAnalysisStatuses(bcsFinance: BusinessImpactAnalysisStatuses[]) {
        this._biaStatuses = bcsFinance;
        this.loaded = true;
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
    get allItems(): BusinessImpactAnalysisStatuses[] {
        return this._biaStatuses.slice();
    }

}

export const BusinessImpactAnalysisStatusesMasterStore = new Store();