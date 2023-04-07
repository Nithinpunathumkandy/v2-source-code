import { observable, action, computed } from "mobx-angular";
import { AmAnnualAuditPlanPaginationResponse,AmAnnualAuditPlan } from "src/app/core/models/audit-management/am-audit-plan/am-annual-audit-plan";
// import { AmAnnualAuditPlan, AmAnnualAuditPlanPaginationResponse } from "src/app/core/models/audit-management/am-audit-plan/am-audit-plan";
// import {AnnualAuditPlanPaginationResponse, IndividualAnnualAuditPlan } from 'src/app/core/models/audit-management/am-audit-plan';
class Store {
    @observable
    private _annualAuditPlanList = [];

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'annual_audit_plans.reference_code';

    @observable
    private _individualAnnualAuditPlanDetails: AmAnnualAuditPlan;

    @observable
    individual_annual_audit_plan_loaded: boolean = false;

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
    annualAuditPlanId:number = null;

    @observable
    view_more: boolean = false;

    @observable
    lastInsertedId:number = null;

    @action
    setAnnualAuditPlanDetails(response: AmAnnualAuditPlanPaginationResponse) {
        this._annualAuditPlanList = response.data;
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
    get annualAuditPlanDetails(){

        return this._annualAuditPlanList.slice();
    }

    getAnnualAuditPlanById(id: number): AmAnnualAuditPlan {
        let annualAuditPlanList;

        annualAuditPlanList = this._annualAuditPlanList.slice().find(e => e.id == id);
        this.setIndividualAnnualAuditPlanDetails(annualAuditPlanList);
        return annualAuditPlanList;
    }

    @action
    setIndividualAnnualAuditPlanDetails(details:AmAnnualAuditPlan) {
        this.individual_annual_audit_plan_loaded = true;
        this._individualAnnualAuditPlanDetails = details;
        // this.updateAnnualAuditPlan(details);
    }

    unsetIndiviudalAnnualAuditPlanDetails() {
        this._individualAnnualAuditPlanDetails = null;
        this.individual_annual_audit_plan_loaded = false;
    }

    unsetIndividualAuditPlanList() {
        this._annualAuditPlanList = [];
        this.loaded = false;
    }

    setAnnualAuditPlanId(id){
        this.annualAuditPlanId = id;
    }

    unsetAnnualAuditPlanId(){
        this.annualAuditPlanId = null;
    }

   
    @computed
    get individualAnnualAuditPlanDetails(): AmAnnualAuditPlan {
        return this._individualAnnualAuditPlanDetails;
    }




}

export const AmAnnualAuditPlansStore = new Store();