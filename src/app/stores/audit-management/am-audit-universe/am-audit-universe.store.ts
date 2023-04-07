import { observable, action, computed } from "mobx-angular";
import { AmAuditPlan, AmAuditPlanPaginationResponse } from "src/app/core/models/audit-management/am-audit-plan/am-audit-plan";
import { AmAuditableItemObjectives, AmAuditableItemProcesses, AmAuditableItemRisks,AmAuditableItemDepartments } from "src/app/core/models/audit-management/am-audit-plan/am-auditable-item";
// import {AuditPlanPaginationResponse, IndividualAuditPlan } from 'src/app/core/models/audit-management/am-audit-plan';
class Store {
    @observable
    private _processes = [];

    @observable
    private _risks = [];

    @observable
    private _objectives = [];
    
    @observable
    private _departments = [];

    @observable
    process_loaded: boolean = false;

    @observable
    risk_loaded: boolean = false;

    @observable
    objective_loaded: boolean = false;

    @observable
    department_loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'audit_universes.reference_code';

    @observable
    riskOrderBy: 'asc' | 'desc' = 'desc';

    @observable
    riskOrderItem: string = 'audit_universes.reference_code';

    @observable
    objectiveOrderBy: 'asc' | 'desc' = 'desc';

    @observable
    objectiveOrderItem: string = 'audit_universes.reference_code';

    @observable
    departmentOrderBy: 'asc' | 'desc' = 'desc';

    @observable
    departmentOrderItem: string = 'audit_universes.reference_code';


    @observable
    processCurrentPage: number = 1;

    @observable
    processItemsPerPage: number = null;

    @observable
    processTotalItems: number = null;

    @observable
    riskCurrentPage: number = 1;

    @observable
    riskItemsPerPage: number = null;

    @observable
    riskTotalItems: number = null;

    @observable
    objectiveCurrentPage: number = 1;

    @observable
    objectiveItemsPerPage: number = null;

    @observable
    objectiveTotalItems: number = null;

    @observable
    departmentCurrentPage: number = 1;

    @observable
    departmentItemsPerPage: number = null;

    @observable
    departmentTotalItems: number = null;

    @observable
    selected: number = null;

    @observable
    searchText: string;

    @observable
    riskSearchText: string;
    
    @observable
    departmentSearchText: string;
    
    @observable
    objectiveSearchText: string;


    @action
    setAuditUniverseProcesses(response: AmAuditableItemProcesses) {
        this._processes = response.data;
        this.processCurrentPage = response.current_page;
        this.processItemsPerPage = response.per_page;
        this.processTotalItems = response.total;
        this.process_loaded = true;

    }

    @action
    setAuditUniverseRisks(response: AmAuditableItemRisks) {
        this._risks = response.data;
        this.riskCurrentPage = response.current_page;
        this.riskItemsPerPage = response.per_page;
        this.riskTotalItems = response.total;
        this.risk_loaded = true;

    }

    @action
    setAuditUniverseObjectives(response: AmAuditableItemObjectives) {
        this._objectives = response.data;
        this.objectiveCurrentPage = response.current_page;
        this.objectiveItemsPerPage = response.per_page;
        this.objectiveTotalItems = response.total;
        this.objective_loaded = true;

    }

    @action
    setAuditUniverseDepartments(response: AmAuditableItemDepartments) {
        this._departments = response.data;
        this.departmentCurrentPage = response.current_page;
        this.departmentItemsPerPage = response.per_page;
        this.departmentTotalItems = response.total;
        this.department_loaded = true;

    }


    @computed
    get processes() {

        return this._processes.slice();
    }

    @computed
    get risks() {

        return this._risks.slice();
    }

    @computed
    get objectives() {

        return this._objectives.slice();
    }

    @computed
    get departments() {

        return this._departments.slice();
    }


    @action
    setProcessCurrentPage(current_page: number) {
        this.processCurrentPage = current_page;
    }

    
    @action
    setRiskCurrentPage(current_page: number) {
        this.riskCurrentPage = current_page;
    }

    
    @action
    setObjectiveCurrentPage(current_page: number) {
        this.objectiveCurrentPage = current_page;
    }

    @action
    setDepartmentCurrentPage(current_page: number) {
        this.departmentCurrentPage = current_page;
    }


}

export const AmAuditUniverseStore = new Store();