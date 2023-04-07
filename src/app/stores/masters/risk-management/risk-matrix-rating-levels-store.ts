import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { RiskMatrixRatingLevels,RiskMatrixRatingLevelsPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-matrix-rating-levels';

class Store {
    @observable
    private _riskMatrixRatingLevels: RiskMatrixRatingLevels[] = [];

    @observable
    loaded: boolean = false;

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
    orderItem: string = 'risk_matrix_rating_level_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setRiskMatrixRatingLevels(response: RiskMatrixRatingLevelsPaginationResponse) {
        
        this._riskMatrixRatingLevels = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllRiskMatrixRatingLevels(riskMatrixRatingLevels: RiskMatrixRatingLevels[]) {
       
        this._riskMatrixRatingLevels = riskMatrixRatingLevels;
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
    get allItems(): RiskMatrixRatingLevels[] {
        return this._riskMatrixRatingLevels.slice();
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

   

}

export const RiskMatrixRatingLevelsMasterStore = new Store();