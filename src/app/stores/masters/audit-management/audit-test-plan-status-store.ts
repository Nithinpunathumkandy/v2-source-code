import { action, computed, observable } from "mobx";
import { AuditTestPlanStatus, AuditTestPlanStatusPaginationResponse, AuditTestPlanStatusSingle } from "src/app/core/models/masters/audit-management/audit-test-plan-status";

class Store{
    @observable
    private _auditTestPlanStatus: AuditTestPlanStatus[] = [];

    @observable
    loaded: boolean =  false;

    @observable
    currentPage : number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'audit_test_plan_status.created_at';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;

    @observable
    individualLoaded: boolean = false;

    @observable
    individualAuditTestPanStatus: AuditTestPlanStatusSingle;
    
    searchText: string;
    
    @action
    setCurrentPage(current_page: number){
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc'){
        this.orderBy=order_by;
    }

    @action
    setAuditTestPlanStatus(response:AuditTestPlanStatusPaginationResponse){
        this._auditTestPlanStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.from = response.from;
        this.loaded = true;
    }
    
    @action
    setAllAuditTestPlanStateses(type: AuditTestPlanStatus[]){
        this._auditTestPlanStatus = type;
        this.loaded = true;
    }

    @action
    setIndividualAuditTestsPlanStatus(auditTestPlanStatus: AuditTestPlanStatusSingle) {
        this.individualAuditTestPanStatus = auditTestPlanStatus;
        this.individualLoaded = true;
    }

    @action
    updateEventType(AuditTestPlanStatus: AuditTestPlanStatus) {
        const auditTestPlanStatus: AuditTestPlanStatus[] = this._auditTestPlanStatus.slice();
        const index: number = auditTestPlanStatus.findIndex(e => e.id == AuditTestPlanStatus.id);
        if (index != -1) {
            AuditTestPlanStatus[index] = AuditTestPlanStatus;
            this._auditTestPlanStatus = auditTestPlanStatus;
        }
    }


    @computed
    get allItems(): AuditTestPlanStatus[]{
        return this._auditTestPlanStatus.slice();
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getAuditTestPlanStatesById(id: number){
        return this._auditTestPlanStatus.slice().find(e=> e.id == id);
    }
}
export const AuditTestPlanStatusMasterStore = new Store();