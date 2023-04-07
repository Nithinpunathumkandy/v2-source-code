import { observable, action, computed } from "mobx-angular";
import { AuditManagementLikelihood, AuditManagementLikelihoodPaginationResponse } from "src/app/core/models/masters/audit-management/audit-management-likelihood";

class Store {
    @observable
    private _auditManagementLikelihood: AuditManagementLikelihood[] = [];

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
    orderItem: string = 'am_likelihoods.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    auditManagementLikelihoodDetails: any;

    searchText: string;

    @action
    setAuditManagementLikelihood(response: AuditManagementLikelihoodPaginationResponse) {

        this._auditManagementLikelihood = response.data;
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
    updateAuditManagementLikelihood(type: AuditManagementLikelihood) {
        // const Location: AuditManagementLikelihood[] = this._auditManagementLikelihood.slice();
        // const index: number = Location.findIndex(e => e.id == type.id);
        // if (index != -1) {
        //     Location[index] = type;
        //     this._auditManagementLikelihood = Location;
        // }
        this.auditManagementLikelihoodDetails=type
    }

    @computed
    get AuditManagementLikelihood(): AuditManagementLikelihood[] {

        return this._auditManagementLikelihood.slice();
    }
    @computed
    get allItems(): AuditManagementLikelihood[] {

        return this._auditManagementLikelihood.slice();
    }

    @action
    getAuditManagementLikelihoodById(id: number): AuditManagementLikelihood {
        return this._auditManagementLikelihood.slice().find(e => e.id == id);
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

export const AuditManagementLikelihoodMasterStore = new Store();