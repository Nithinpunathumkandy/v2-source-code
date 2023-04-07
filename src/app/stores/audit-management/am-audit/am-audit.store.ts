import { observable, action, computed } from "mobx-angular";
import { AmAuditProgress } from "src/app/core/models/audit-management/am-audit-field-work/am-audit-field-work";
import { AmAudit, AmAuditPaginationResponse } from "src/app/core/models/audit-management/am-audit/am-audit";
import { AuthStore } from "../../auth.store";
// import {AuditPaginationResponse, IndividualAudit } from 'src/app/core/models/audit-management/am-audit-plan';
class Store {
    @observable
    private _auditList = [];

    @observable
    private _auditProgress;

    @observable
    progressLoaded:boolean = false;

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'audit_Plans.reference_code';

    @observable
    private _individualAuditDetails: AmAudit;

    @observable
    individual_audit_loaded: boolean = false;

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
    auditId:number = null;

    @observable
    view_more: boolean = false;

    @observable
    lastInsertedId:number = null;

    @action
    setAuditDetails(response: AmAuditPaginationResponse) {
        this._auditList = response.data;
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
    get auditDetails(){

        return this._auditList.slice();
    }

    getAuditById(id: number): AmAudit {
        let auditList;

        auditList = this._auditList.slice().find(e => e.id == id);
        this.setIndividualAuditDetails(auditList);
        return auditList;
    }

    @action
    setIndividualAuditDetails(details:AmAudit) {
        this.individual_audit_loaded = true;
        this._individualAuditDetails = details;
        // this.updateAudit(details);
    }

    unsetIndiviudalAuditDetails() {
        this._individualAuditDetails = null;
        this.individual_audit_loaded = false;
    }

    setAuditId(id){
        this.auditId = id;
    }

    unsetAuditId(){
        this.auditId = null;
    }

    @action
    setAuditProgress(details) {
        this.progressLoaded = true;
        this._auditProgress = details;
        // this.updateAudit(details);
    }


    @computed
    get auditProgress(): AmAuditProgress {
        return this._auditProgress;
    }


   
    @computed
    get individualAuditDetails(): AmAudit {
        return this._individualAuditDetails;
    }

    editAccessUser(){
        let pos = AmAuditsStore.individualAuditDetails?.am_individual_audit_plan?.auditors?.findIndex(e=>e.id==AuthStore.user?.id)
        if(AuthStore.user?.id==AmAuditsStore.individualAuditDetails?.am_individual_audit_plan?.audit_manager_id){
          return true;
        }
        else if(pos!=-1)
        return true;
        else
        return false;
      }



}

export const AmAuditsStore = new Store();