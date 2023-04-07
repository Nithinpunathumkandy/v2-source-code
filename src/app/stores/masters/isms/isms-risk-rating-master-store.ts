import { observable, action, computed } from "mobx-angular";
import { IsmsRiskRating, IsmsRiskRatingPaginationResponse } from "src/app/core/models/masters/Isms/isms-risk-rating";
import { RiskRatingByLanguage } from "src/app/core/models/masters/risk-management/risk-rating";


class Store {
    @observable
    private _ismsRiskRating: IsmsRiskRating[] = [];

    @observable
    private _allIsmsRiskRating: RiskRatingByLanguage[] = [];

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
    orderItem: string = 'isms_risk_rating_language.id';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setIsmsRiskRating(response: IsmsRiskRatingPaginationResponse) {
        
        this._ismsRiskRating = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllIsmsRiskRating(status: RiskRatingByLanguage[]) {
       
        this._allIsmsRiskRating = status;
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
    get allItems(): IsmsRiskRating[] {
        return this._ismsRiskRating.slice();
    }

    @computed
    get allLanguageRiskRating(){
        return this._allIsmsRiskRating.slice();
    }



}

export const IsmsRiskRatingMasterStore = new Store();