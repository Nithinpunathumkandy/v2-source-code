import { observable, action, computed } from "mobx-angular";
import { AmAuditPlan, AmAuditPlanPaginationResponse } from "src/app/core/models/audit-management/am-audit-plan/am-audit-plan";
import { AmAuditableItemObjectives, AmAuditableItemProcesses, AmAuditableItemRisks, AmAuditableItems,AmAuditableItemDepartments, AuditableItems } from "src/app/core/models/audit-management/am-audit-plan/am-auditable-item";
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
    private _auditableItems = [];

    @observable
    private _allAuditableItems = [];

    @observable
    process_loaded: boolean = false;

    @observable
    risk_loaded: boolean = false;

    @observable
    objective_loaded: boolean = false;

    @observable
    department_loaded: boolean = false;

    @observable
    loaded: boolean = false;

    @observable
    allLoaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'audit_Plans.reference_code';

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;


    @observable
    processCurrentPage: number = 1;

    @observable
    processItemsPerPage: number = null;

    @observable
    processTotalItems: number = null;

    @observable
    departmentCurrentPage: number = 1;

    @observable
    departmentItemsPerPage: number = null;

    @observable
    departmentTotalItems: number = null;

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
    selected: number = null;

    @observable
    searchText: string;


    @action
    setAuditableItemProcesses(response: AmAuditableItemProcesses) {
        this._processes = response.data;
        this.processCurrentPage = response.current_page;
        this.processItemsPerPage = response.per_page;
        this.processTotalItems = response.total;
        this.process_loaded = true;

    }

    @action
    setAuditableItemRisks(response: AmAuditableItemRisks) {
        this._risks = response.data;
        this.riskCurrentPage = response.current_page;
        this.riskItemsPerPage = response.per_page;
        this.riskTotalItems = response.total;
        this.risk_loaded = true;

    }

    @action
    setAuditableItemObjectives(response: AmAuditableItemObjectives) {
        this._objectives = response.data;
        this.objectiveCurrentPage = response.current_page;
        this.objectiveItemsPerPage = response.per_page;
        this.objectiveTotalItems = response.total;
        this.objective_loaded = true;

    }

    @action
    setAuditableItemDepartments(response: AmAuditableItemDepartments) {
        this._departments = response.data;
        this.departmentCurrentPage = response.current_page;
        this.departmentItemsPerPage = response.per_page;
        this.departmentTotalItems = response.total;
        this.department_loaded = true;

    }

    @action
    setAuditableItems(response: AmAuditableItems) {
        this._auditableItems = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;

    }

    @action
    setAllAuditableItems(response: AuditableItems[]) {
        this._allAuditableItems = response;
       
        this.allLoaded = true;

    }


    @computed
    get allAuditableItems() {

        return this._allAuditableItems.slice();
    }

    @action
    unsetAuditableItemDatas(){
        this.risk_loaded = false;
        this.process_loaded = false;
        this.objective_loaded = false;
        this.department_loaded = false;
        this._processes =[];
        this._risks = [];
        this._objectives = [];
        this._departments =[];
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

    @computed
    get auditableItems() {

        return this._auditableItems.slice();
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
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



    // @computed
    // get auditPlanDetails(){

    //     return this._auditPlanList.slice();
    // }

    // getAuditPlanById(id: number): AmAuditPlan {
    //     let auditPlanList;

    //     auditPlanList = this._auditPlanList.slice().find(e => e.id == id);
    //     this.setIndividualAuditPlanDetails(auditPlanList);
    //     return auditPlanList;
    // }

    // @action
    // setIndividualAuditPlanDetails(details:AmAuditPlan) {
    //     this.individual_auditPlan_loaded = true;
    //     this._individualAuditPlanDetails = details;
    //     // this.updateAuditPlan(details);
    // }

    // unsetIndiviudalAuditPlanDetails() {
    //     this._individualAuditPlanDetails = null;
    //     this.individual_auditPlan_loaded = false;
    // }

    // setAuditPlanId(id){
    //     this.auditPlanId = id;
    // }

    // unsetAuditPlanId(){
    //     this.auditPlanId = null;
    // }


    // @computed
    // get individualAuditPlanDetails(): AmAuditPlan {
    //     return this._individualAuditPlanDetails;
    // }




}

export const AmAuditableItemStore = new Store();