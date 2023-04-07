import { observable, action, computed } from "mobx-angular";
import { AuditManagementSelfAssessmentStatus, AuditManagementSelfAssessmentStatusPaginationResponse } from "src/app/core/models/masters/audit-management/am-audit-control-self-assessment-status";

class Store {
    @observable
    private _auditManagementSelfAssessmentStatus: AuditManagementSelfAssessmentStatus[] = [];

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
    auditManagementSelfAssessmentStatus: any;

    searchText: string;

    @action
    setAuditManagementSelfAssessmentStatus(response: AuditManagementSelfAssessmentStatusPaginationResponse) {

        this._auditManagementSelfAssessmentStatus = response.data;
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
    updateAuditManagementLikelihood(type: AuditManagementSelfAssessmentStatus) {
        // const Location: AuditManagementLikelihood[] = this._auditManagementSelfAssessmentStatus.slice();
        // const index: number = Location.findIndex(e => e.id == type.id);
        // if (index != -1) {
        //     Location[index] = type;
        //     this._auditManagementSelfAssessmentStatus = Location;
        // }
        this.auditManagementSelfAssessmentStatus=type
    }

    @computed
    get AuditManagementSelfAssessmentStatus(): AuditManagementSelfAssessmentStatus[] {

        return this._auditManagementSelfAssessmentStatus.slice();
    }
    @computed
    get allItems(): AuditManagementSelfAssessmentStatus[] {

        return this._auditManagementSelfAssessmentStatus.slice();
    }

    @action
    getAuditManagementLikelihoodById(id: number): AuditManagementSelfAssessmentStatus {
        return this._auditManagementSelfAssessmentStatus.slice().find(e => e.id == id);
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

export const AuditManagementControlSelfAssessmentStatusStore = new Store();