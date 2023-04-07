import { observable, action, computed } from "mobx-angular";
import { KpiManagementStatus, KpiManagementStatusPaginationResponse } from "src/app/core/models/masters/kpi-management/kpi-management-status";

class Store {
    @observable
    private _kpiManagementStatus: KpiManagementStatus[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'kpi_management_statuses.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    searchText: string;

    @action
    setKpiManagementStatus(response: KpiManagementStatusPaginationResponse) {        
        this._kpiManagementStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllKpiManagementStatus(KpiManagementStatus: KpiManagementStatus[]) {
        this._kpiManagementStatus = KpiManagementStatus;
        this.loaded = true;
    }

    @action
    updateKpiManagementStatus(type: KpiManagementStatus) {
        const types: KpiManagementStatus[] = this._kpiManagementStatus.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._kpiManagementStatus = types;
        }
    }

    @action
    getKpiManagementStatusById(id: number): KpiManagementStatus {
        return this._kpiManagementStatus.slice().find(e => e.id == id);
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
    get allItems(): KpiManagementStatus[] {
        return this._kpiManagementStatus.slice();
    }

}

export const KpiManagementStatusMasterStore = new Store();