import { observable, action, computed } from "mobx-angular";
import { AuditPlanStatuses, AuditPlanStatusesPaginationResponse } from "src/app/core/models/masters/internal-audit/audit-plan-statuses";

class Store {
    @observable
    private _auditPlanStatuses: AuditPlanStatuses[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'audit_plan_status_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setAuditPlanStatuses(response: AuditPlanStatusesPaginationResponse) {        
        this._auditPlanStatuses = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllAuditPlanStatuses(AuditPlanStatuses: AuditPlanStatuses[]) {
        this._auditPlanStatuses = AuditPlanStatuses;
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
    get allItems(): AuditPlanStatuses[] {
        return this._auditPlanStatuses.slice();
    }

}

export const AuditPlanStatusesMasterStore = new Store();