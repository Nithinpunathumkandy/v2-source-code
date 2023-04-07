import { observable, action, computed } from "mobx-angular";
import { ReviewFrequencies, ReviewFrequenciesPaginationResponse } from "src/app/core/models/masters/kpi-management/kpi-review-frequencies";

class Store {
    @observable
    private _reviewFrequenciesList: ReviewFrequencies[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'kpi_review_frequencies.created_at';

    @observable
    from: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

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
    setReviewFrequencies(response: ReviewFrequenciesPaginationResponse) {
        
        this._reviewFrequenciesList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setAllReviewFrequencies(audit: ReviewFrequencies[]) {
    
        this._reviewFrequenciesList = audit;
        this.loaded = true;  
    }

    @computed
    get allItems(): ReviewFrequencies[] { 
        return this._reviewFrequenciesList.slice();
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    geReviewFrequenciesById(id: number): ReviewFrequencies {
        return this._reviewFrequenciesList.slice().find(e => e.id == id);
    }

}

export const KpiReviewFrequenciesStore = new Store();
