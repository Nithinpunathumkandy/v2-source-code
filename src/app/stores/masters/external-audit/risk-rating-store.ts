import { observable, action, computed } from "mobx-angular";

import { RiskRating , RiskRatingPaginationResponse } from 'src/app/core/models/masters/external-audit/risk-rating';

class Store {
    @observable
    private _riskRatings: RiskRating[] = [];

    private _singleRisk: RiskRating;

    @observable 
    loaded:boolean=false;

    @observable
    singleRiskloaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'risk_ratings.created_at';

    @observable
    totalItems: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

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
    setRiskRating(response: RiskRatingPaginationResponse) {
        
        this._riskRatings = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
       
    }

    @action
    setAllRiskRating(risks: RiskRating[]) {
       
        this._riskRatings = risks;
        this.loaded = true;
        
    }
    @action
    setSingleRiskRating(risk: RiskRating){
        this._singleRisk = risk;
        this.singleRiskloaded = true;
    }

    @computed
    get allItems(): RiskRating[] {
        
        return this._riskRatings.slice();
    }

    @action
    getRiskRatingById(id: number): RiskRating {
        return this._riskRatings.slice().find(e => e.id == id);
    }

    get singleRiskDetails() : RiskRating {

        return this._singleRisk;
    }


}
export const RiskRatingMasterStore = new Store();