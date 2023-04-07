import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { RiskImpactGuideline, RiskImpactGuidelinePaginationResponse,  } from "src/app/core/models/masters/risk-management/risk-impact-guideline";

class Store {
    @observable
    private _RiskImpactGuideline: RiskImpactGuideline[] = [];

    @observable
    private _RiskRatingImpactGuideline: RiskImpactGuideline[] = [];

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
    orderItem: string = 'risk_impact_guidelines.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setRiskImpactGuideline(response: RiskImpactGuidelinePaginationResponse) {

        this._RiskImpactGuideline = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setRiskRatingImpactGuideline(res: RiskImpactGuideline[]) {

        this._RiskRatingImpactGuideline = res;
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
    updateRiskImpactGuideline(type: RiskImpactGuideline) {
        const types: RiskImpactGuideline[] = this._RiskImpactGuideline.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._RiskImpactGuideline = types;
        }
    }

    @computed
    get RiskImpactGuideline(): RiskImpactGuideline[] {

        return this._RiskImpactGuideline.slice();
    }

    @computed
    get RiskRatingImpactGuideline(): RiskImpactGuideline[] {

        return this._RiskRatingImpactGuideline.slice();
    }

    @computed
    get allItems(): RiskImpactGuideline[] {

        return this._RiskImpactGuideline.slice();
    }

    @action
    getRiskImpactGuidelineById(id: number): RiskImpactGuideline {
        return this._RiskImpactGuideline.slice().find(e => e.id == id);
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

export const RiskImpactGuidelineMasterStore = new Store();