import { observable, action, computed } from "mobx-angular";
import { IsmsRiskImpactGuideline, IsmsRiskImpactGuidelinePaginationResponse } from "src/app/core/models/masters/isms/isms-risk-impact-gudeline";

class Store {
    @observable
    private _IsmsRiskImpactGuideline: IsmsRiskImpactGuideline[] = [];

    @observable
    private _ismsRiskRatingImpactGuideline: IsmsRiskImpactGuideline[] = [];

    @observable
    loaded: boolean = false;

    @observable
    impactloaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    lastInsertedId: number = null;

    @observable
    orderItem: string = 'isms_risk_impact_guidelines.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setIsmsRiskImpactGuideline(response: IsmsRiskImpactGuidelinePaginationResponse) {

        this._IsmsRiskImpactGuideline = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setIsmsRiskRatingImpactGuideline(res: IsmsRiskImpactGuideline[]) {

        this._ismsRiskRatingImpactGuideline = res;
        this.impactloaded = true;
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
    updateIsmsRiskImpactGuideline(type: IsmsRiskImpactGuideline) {
        const types: IsmsRiskImpactGuideline[] = this._IsmsRiskImpactGuideline.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._IsmsRiskImpactGuideline = types;
        }
    }

    @computed
    get IsmsRiskImpactGuideline(): IsmsRiskImpactGuideline[] {

        return this._IsmsRiskImpactGuideline.slice();
    }

    @computed
    get IsmsRiskRatingImpactGuideline(): IsmsRiskImpactGuideline[] {

        return this._ismsRiskRatingImpactGuideline.slice();
    }

    @computed
    get allItems(): IsmsRiskImpactGuideline[] {

        return this._IsmsRiskImpactGuideline.slice();
    }

    @action
    getIsmsRiskImpactGuidelineById(id: number): IsmsRiskImpactGuideline {
        return this._IsmsRiskImpactGuideline.slice().find(e => e.id == id);
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

export const IsmsRiskImpactGuidelineMasterStore = new Store();