import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { RiskRating,RiskRatingPaginationResponse,RiskRatingByLanguage } from 'src/app/core/models/masters/risk-management/risk-rating';

class Store {
    @observable
    private _riskRating: RiskRating[] = [];

    @observable
    private _allRiskRating: RiskRatingByLanguage[] = [];

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
    orderItem: string = 'risk_rating_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setRiskRating(response: RiskRatingPaginationResponse) {
        
        this._riskRating = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllRiskRating(response: RiskRatingByLanguage[]) {
        
        this._allRiskRating = response;
        this.allLoaded = true;
    }

    // @action
    // setAllRiskRating(riskRating: RiskRating[]) {
       
    //     this._riskRating = riskRating;
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
    get allItems(): RiskRating[] {
        return this._riskRating.slice();
    }

    @computed
    get allLanguageRiskRating(){
        return this._allRiskRating.slice();
    }


}

export const RiskRatingMasterStore = new Store();