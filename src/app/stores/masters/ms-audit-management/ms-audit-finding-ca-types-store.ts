import { observable, action, computed } from "mobx-angular";
import { MSAuditFindingCATypes, MSAuditFindingCATypesPaginationResponse } from "src/app/core/models/masters/ms-audit-management/ms-audit-finding-ca-types";

class Store {

    @observable
    private _MSAuditFindingCATypes: MSAuditFindingCATypes[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'ms_audit_finding_corrective_action_types.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setMSAuditFindingCATypes(response: MSAuditFindingCATypesPaginationResponse) {        
        this._MSAuditFindingCATypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    // @action
    // updateMSAuditFindingCATypes(type: MSAuditFindingCATypes) {
    //     const types: MSAuditFindingCATypes[] = this._MSAuditFindingCATypes.slice();
    //     const index: number = types.findIndex(e => e.id == type.id);
    //     if (index != -1) {
    //         types[index] = type;
    //         this._MSAuditFindingCATypes = types;
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
    get allItems(): MSAuditFindingCATypes[] {
        return this._MSAuditFindingCATypes;
    }

}

export const MSAuditFindingCATypesMasterStore = new Store();