import { observable, action, computed } from "mobx-angular";
import { AmAuditPlan, AmAuditPlanPaginationResponse } from "src/app/core/models/audit-management/am-audit-plan/am-audit-plan";
import { AmAuditSummary , SummaryDepartment } from "src/app/core/models/audit-management/am-audit-plan/am-audit-summary";
import { AmAuditableItemObjectives, AmAuditableItemProcesses, AmAuditableItemRisks, AmAuditableItems } from "src/app/core/models/audit-management/am-audit-plan/am-auditable-item";
// import {AuditPlanPaginationResponse, IndividualAuditPlan } from 'src/app/core/models/audit-management/am-audit-plan';
class Store {


    @observable
    private _summaryData = null;

    @observable
    private _auditeeDepartment: SummaryDepartment[];

    @observable
    private _auditors = null;

    @observable
    private _auditCalendar = null;

    @observable
    private _auditByManager = null;

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'audit_Plans.reference_code';

    @observable
    searchText: string;

    @observable
    calendarLoaded: boolean = false

    @observable
    auditeeDepartmentLoaded: boolean = false

    @observable
    auditorsLoaded: boolean = false

    @observable
    auditByManagersLoaded: boolean = false

    @action
    setAuditSummary(response: AmAuditSummary) {
        this._summaryData = response;
        this.loaded = true;
    }


    @computed
    get summaryData() {
        return this._summaryData;
    }

    @action
    setAuditeeDepartment(response: SummaryDepartment[]) {
        this._auditeeDepartment = response;
        this.auditeeDepartmentLoaded = true;
    }

    @computed
    get auditeeDepartment():SummaryDepartment[] {
        return this._auditeeDepartment;
    }

    @action
    setAuditors(response: AmAuditSummary) {
        this._auditors = response;
        this.auditorsLoaded = true;
    }

    @computed
    get auditors() {
        return this._auditors;
    }

    @action
    setAuditCalendar(response: AmAuditSummary) {
        this._auditCalendar = response;
        this.calendarLoaded = true;
    }

    @computed
    get auditCalendar() {
        return this._auditCalendar;
    }

    @action
    setAuditByManager(response: AmAuditSummary) {
        this._auditByManager = response;
        this.auditByManagersLoaded = true;
    }

    @computed
    get auditByManager() {
        return this._auditByManager;
    }

}

export const AmAuditSummaryStore = new Store();