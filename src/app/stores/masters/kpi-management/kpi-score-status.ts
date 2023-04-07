import { observable, action, computed } from "mobx-angular";
import { KpiScoreStatus, KpiScoreStatusPaginationResponse } from "src/app/core/models/masters/kpi-management/kpi-score-status";

class Store {
    @observable
    private _kpiScoreStatus: KpiScoreStatus[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'kpi_management_kpi_score_statuses.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    searchText: string;

    @action
    setKpiScoreStatuses(response: KpiScoreStatusPaginationResponse) {        
        this._kpiScoreStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllKpiManagementStatus(KpiScoreStatus: KpiScoreStatus[]) {
        this._kpiScoreStatus = KpiScoreStatus;
        this.loaded = true;
    }

    @action
    updateKpiScoreStatuses(type: KpiScoreStatus) {
        const types: KpiScoreStatus[] = this._kpiScoreStatus.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._kpiScoreStatus = types;
        }
    }

    @action
    getKpiScoreStatusesById(id: number): KpiScoreStatus {
        return this._kpiScoreStatus.slice().find(e => e.id == id);
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
    get allItems(): KpiScoreStatus[] {
        return this._kpiScoreStatus.slice();
    }

}

export const KpiScoreStatusMasterStore = new Store();