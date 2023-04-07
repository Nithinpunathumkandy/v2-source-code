import { observable, action, computed } from "mobx-angular";
import { AuditManagementImpact, AuditManagementImpactPaginationResponse } from "src/app/core/models/masters/audit-management/audit-management-impact";

class Store {
    @observable
    private _auditManagementImpact: AuditManagementImpact[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    lastInsertedId: number = null;

    @observable
    orderItem: string = 'am_impact.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    auditManagementImpactDetails: any;

    searchText: string;

    @action
    setAuditManagementImpact(response: AuditManagementImpactPaginationResponse) {

        this._auditManagementImpact = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
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
    updateAuditManagementImpact(type: AuditManagementImpact) {
        // const Location: AuditManagementImpact[] = this._auditManagementImpact.slice();
        // const index: number = Location.findIndex(e => e.id == type.id);
        // if (index != -1) {
        //     Location[index] = type;
        //     this._auditManagementImpact = Location;
        // }
        this.auditManagementImpactDetails=type
    }

    @computed
    get AuditManagementImpact(): AuditManagementImpact[] {

        return this._auditManagementImpact.slice();
    }
    @computed
    get allItems(): AuditManagementImpact[] {

        return this._auditManagementImpact.slice();
    }

    @action
    getAuditManagementImpactById(id: number): AuditManagementImpact {
        return this._auditManagementImpact.slice().find(e => e.id == id);
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

export const AuditManagementImpactMasterStore = new Store();