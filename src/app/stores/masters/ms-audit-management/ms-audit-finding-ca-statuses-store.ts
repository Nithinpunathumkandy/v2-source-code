import { observable, action, computed } from "mobx-angular";
import { MSAuditFindingCAStatuses, MSAuditFindingCAStatusesPaginationResponse } from "src/app/core/models/masters/ms-audit-management/ms-audit-finding-ca-statuses";

class Store {

    @observable
    private _MSAuditFindingCAStatuses: MSAuditFindingCAStatuses[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'ms_audit_finding_corrective_action_statuses.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setMSAuditFindingCAStatuses(response: MSAuditFindingCAStatusesPaginationResponse) {        
        this._MSAuditFindingCAStatuses = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    // @action
    // updateMSAuditFindingCAStatuses(type: MSAuditFindingCAStatuses) {
    //     const types: MSAuditFindingCAStatuses[] = this._MSAuditFindingCAStatuses.slice();
    //     const index: number = types.findIndex(e => e.id == type.id);
    //     if (index != -1) {
    //         types[index] = type;
    //         this._MSAuditFindingCAStatuses = types;
    //     }
    // }

    @action
    setCurrentPage(currentPage: number) {
        this.currentPage = currentPage;
    }

    @action
    setOrderBy(orderBy: 'asc' | 'desc') {
        this.orderBy = orderBy;
    }

    @computed
    get allItems(): MSAuditFindingCAStatuses[] {
        return this._MSAuditFindingCAStatuses
    }

}

export const MSAuditFindingCAStatusesMasterStore = new Store();