import { observable, action, computed } from "mobx-angular";
import { IsmsRiskMatrixRatingLevel, IsmsRiskMatrixRatingLevelPaginationResponse } from "src/app/core/models/masters/isms/isms-risk-matrix-rating-level";

class Store {
    @observable
    private _ismsVulnerability: IsmsRiskMatrixRatingLevel[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    lastInsertedId: number = null;

    @observable
    orderItem: string = 'isms_risk_matrix_rating_levels.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setIsmsRiskMatrixRatingLevel(response: IsmsRiskMatrixRatingLevelPaginationResponse) {

        this._ismsVulnerability = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }


    @action
    updateIsmsRiskMatrixRatingLevel(type: IsmsRiskMatrixRatingLevel) {
        const types: IsmsRiskMatrixRatingLevel[] = this._ismsVulnerability.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._ismsVulnerability = types;
        }
    }

    @computed
    get IsmsRiskMatrixRatingLevel(): IsmsRiskMatrixRatingLevel[] {

        return this._ismsVulnerability.slice();
    }
    @computed
    get allItems(): IsmsRiskMatrixRatingLevel[] {

        return this._ismsVulnerability.slice();
    }

    @action
    getIsmsRiskMatrixRatingLevelById(id: number): IsmsRiskMatrixRatingLevel {
        return this._ismsVulnerability.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedId(id: number) {
        this.lastInsertedId = id;
    }

    get LastInsertedId(): number {
        if (this.lastInsertedId)
            return this.lastInsertedId;
        else
            return null;
    }

}

export const IsmsRiskMatrixRatingLevelMasterStore = new Store();