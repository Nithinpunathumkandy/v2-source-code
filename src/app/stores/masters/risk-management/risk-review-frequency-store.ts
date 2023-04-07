import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { RiskReviwFrequency,RiskReviewFrequencyPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-review-frequency';

class Store {
    @observable
    private _riskReviewFrequency: RiskReviwFrequency[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'risk_review_frequency_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setRiskReviewFrequency(response: RiskReviewFrequencyPaginationResponse) {
        
        this._riskReviewFrequency = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllRiskReviewFrequency(riskReviewFrequency: RiskReviwFrequency[]) {
       
        this._riskReviewFrequency = riskReviewFrequency;
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
    get allItems(): RiskReviwFrequency[] {
        return this._riskReviewFrequency.slice();
    }

}

export const RiskReviewFrequencyMasterStore = new Store();