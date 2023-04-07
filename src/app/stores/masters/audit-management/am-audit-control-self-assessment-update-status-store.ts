import { observable, action, computed } from "mobx-angular";
import { SelfAssessmentStatus,SelfAssessmentStatusPaginationResponse } from "src/app/core/models/masters/audit-management/am-audit-control-self-assessment-update-status";


class Store {
    @observable
    private _selfAssessmentStatus: SelfAssessmentStatus[] = [];

    @observable
    private _individualSelfAssessmentStatus: SelfAssessmentStatus[] = [];
    
    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'am_annual_plan_statuses.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setSelfAssessmentStatus(response: SelfAssessmentStatusPaginationResponse) {        
        this._selfAssessmentStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllSelfAssessmentStatus(SelfAssessmentStatus: SelfAssessmentStatus[]) {
        this._selfAssessmentStatus = SelfAssessmentStatus;
        this.loaded = true;
    }

    @action
    updateSelfAssessmentStatus(type: SelfAssessmentStatus) {
        const types: SelfAssessmentStatus[] = this._selfAssessmentStatus.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._individualSelfAssessmentStatus = types;
        }
    }

    @action
    getSelfAssessmentStatusById(id: number): SelfAssessmentStatus {
        return this._selfAssessmentStatus.slice().find(e => e.id == id);
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
    get allItems(): SelfAssessmentStatus[] {
        return this._selfAssessmentStatus.slice();
    }

}

export const SelfAssessmentStatusMasterStore = new Store();