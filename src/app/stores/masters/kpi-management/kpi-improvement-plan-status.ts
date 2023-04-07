import { observable, action, computed } from "mobx-angular";
import { KpiImprovementPlansStatus, KpiImprovementPlansStatusPaginationResponse } from "src/app/core/models/masters/kpi-management/kpi-improvrement-plan-status";

class Store {
    @observable
    private _kpiImprovementPlanStatus: KpiImprovementPlansStatus[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'kpi_improvement_Plans_statuses.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    searchText: string;

    @action
    setKpiImprvementPlansStatus(response: KpiImprovementPlansStatusPaginationResponse) {        
        this._kpiImprovementPlanStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllKpiImprovementPlansStatus(KpiImprovementPlansStatus: KpiImprovementPlansStatus[]) {
        this._kpiImprovementPlanStatus = KpiImprovementPlansStatus;
        this.loaded = true;
    }

    @action
    updateKpiImprovementPlansStatus(type: KpiImprovementPlansStatus) {
        const types: KpiImprovementPlansStatus[] = this._kpiImprovementPlanStatus.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._kpiImprovementPlanStatus = types;
        }
    }

    @action
    getKpiImprovementPlansStatusById(id: number): KpiImprovementPlansStatus {
        return this._kpiImprovementPlanStatus.slice().find(e => e.id == id);
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
    get allItems(): KpiImprovementPlansStatus[] {
        return this._kpiImprovementPlanStatus.slice();
    }

}

export const KpiImprovementPlanStatusMasterStore = new Store();