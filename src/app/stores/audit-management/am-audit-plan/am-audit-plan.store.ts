import { observable, action, computed } from "mobx-angular";
import { AmAuditPlan, AmAuditPlanPaginationResponse } from "src/app/core/models/audit-management/am-audit-plan/am-audit-plan";
// import {AuditPlanPaginationResponse, IndividualAuditPlan } from 'src/app/core/models/audit-management/am-audit-plan';
class Store {
    @observable
    private _auditPlanList = [];

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'audit_Plans.reference_code';

    @observable
    private _individualAuditPlanDetails: AmAuditPlan;

    @observable
    individual_auditPlan_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    selected: number = null;

    @observable
    searchText: string;

    @observable
    auditPlanId:number = null;

    @observable
    view_more: boolean = false;

    @observable
    lastInsertedId:number = null;

    @action
    setAuditPlanDetails(response: AmAuditPlanPaginationResponse) {
        this._auditPlanList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }



    @computed
    get auditPlanDetails(){

        return this._auditPlanList.slice();
    }

    getAuditPlanById(id: number): AmAuditPlan {
        let auditPlanList;

        auditPlanList = this._auditPlanList.slice().find(e => e.id == id);
        this.setIndividualAuditPlanDetails(auditPlanList);
        return auditPlanList;
    }

    @action
    setIndividualAuditPlanDetails(details:AmAuditPlan) {
        this.individual_auditPlan_loaded = true;
        this._individualAuditPlanDetails = details;
        // this.updateAuditPlan(details);
    }

    unsetIndiviudalAuditPlanDetails() {
        this._individualAuditPlanDetails = null;
        this.individual_auditPlan_loaded = false;
    }

    unsetAuditPlanList() {
        this._auditPlanList = [];
        this.loaded = false;
    }

    setAuditPlanId(id){
        this.auditPlanId = id;
    }

    unsetAuditPlanId(){
        this.auditPlanId = null;
    }

   
    @computed
    get individualAuditPlanDetails(): AmAuditPlan {
        return this._individualAuditPlanDetails;
    }




}

export const AmAuditPlansStore = new Store();