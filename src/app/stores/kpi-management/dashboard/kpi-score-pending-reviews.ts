import { action, observable, computed } from "mobx-angular";
import { KpiScorePendingReviews, KpiScorePendingReviewsPaginationResponse } from "src/app/core/models/kpi-management/dashboard/kpi-pending-reviews";


class Store {
    
    @observable
    private _kpiScorePendingReviews: KpiScorePendingReviews[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = 15;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    orderItem: string = '';

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setKpiScorePendingReviews(response: KpiScorePendingReviewsPaginationResponse) {

        this._kpiScorePendingReviews = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unSetKpiScorePendingReivews(){
        this.loaded = false;
        this.from = null;
        this.totalItems = null;
        this.currentPage = null;
        this._kpiScorePendingReviews = [];
        this.itemsPerPage = null;
    }

    @computed
    get allItems(): KpiScorePendingReviews[] {
        return this._kpiScorePendingReviews.slice();
    }
}

export const KPIScorePendingRivewsDashboardStore = new Store();