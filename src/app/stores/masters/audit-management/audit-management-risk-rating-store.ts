import { observable, action, computed } from "mobx-angular";
import { AuditManagementRiskRating, AuditManagementRiskRatingPaginationResponse } from "src/app/core/models/masters/audit-management/audit-management-risk-rating";

class Store {
    @observable
    private _auditManagementRiskRating: AuditManagementRiskRating[] = [];

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
    orderItem: string = 'am_risk_ratings.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    auditManagementRiskRatingDetails: any;

    searchText: string;

    @action
    setAuditManagementRiskRating(response: AuditManagementRiskRatingPaginationResponse) {

        this._auditManagementRiskRating = response.data;
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
    updateAuditManagementRiskRating(type: AuditManagementRiskRating) {
        // const Location: AuditManagementRiskRating[] = this._auditManagementRiskRating.slice();
        // const index: number = Location.findIndex(e => e.id == type.id);
        // if (index != -1) {
        //     Location[index] = type;
        //     this._auditManagementRiskRating = Location;
        // }
        this.auditManagementRiskRatingDetails=type
    }

    @computed
    get AuditManagementRiskRating(): AuditManagementRiskRating[] {

        return this._auditManagementRiskRating.slice();
    }
    @computed
    get allItems(): AuditManagementRiskRating[] {

        return this._auditManagementRiskRating.slice();
    }

    @action
    getAuditManagementRiskRatingById(id: number): AuditManagementRiskRating {
        return this._auditManagementRiskRating.slice().find(e => e.id == id);
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

export const AuditManagementRiskRatingMasterStore = new Store();