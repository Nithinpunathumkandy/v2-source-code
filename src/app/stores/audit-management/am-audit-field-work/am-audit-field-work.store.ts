import { observable, action, computed } from "mobx-angular";
import { AmAuditFieldWork, AmAuditFieldWorkPaginationResponse, AmAuditProgress, AmAuditProgressResponse } from "src/app/core/models/audit-management/am-audit-field-work/am-audit-field-work";
// import { AmAuditFieldWork, AmAuditFieldWorkPaginationResponse } from "src/app/core/models/audit-management/am-audit-plan/am-audit-plan";
// import {AuditFieldWorkPaginationResponse, IndividualAuditFieldWork } from 'src/app/core/models/audit-management/am-audit-plan';
class Store {
    @observable
    private _auditFieldWorkList = [];

    @observable
    private _auditProgress;

    @observable
    loaded: boolean = false;

    @observable
    progressLoaded:boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'audit_Plans.reference_code';

    @observable
    private _individualAuditFieldWorkDetails: AmAuditFieldWork;

    @observable
    individual_auditFieldWork_loaded: boolean = false;

    // @observable
    // completed_percentage: number = null;

    // @observable
    // audit_hours: number = null;

    // @observable
    // total_findings_count: number = null;

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
    auditFieldWorkId:number = null;

    @observable
    view_more: boolean = false;

    @observable
    lastInsertedId:number = null;

    @action
    setAuditFieldWorkDetails(response: AmAuditFieldWorkPaginationResponse) {
        this._auditFieldWorkList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }

    @action
    setAmAuditProgress(response: AmAuditProgressResponse) {
        this._auditProgress = response;
        this.progressLoaded = true;
        // .risk_ratings;
        // this.completed_percentage = response.completed_percentage;
        // this.audit_hours = response.audit_hours;
        // this.total_findings_count = response.total_findings_count;
       
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }



    @computed
    get auditFieldWorkDetails(){

        return this._auditFieldWorkList.slice();
    }

    getAuditFieldWorkById(id: number): AmAuditFieldWork {
        let auditFieldWorkList;

        auditFieldWorkList = this._auditFieldWorkList.slice().find(e => e.id == id);
        this.setIndividualAuditFieldWorkDetails(auditFieldWorkList);
        return auditFieldWorkList;
    }

    @action
    setIndividualAuditFieldWorkDetails(details:AmAuditFieldWork) {
        this.individual_auditFieldWork_loaded = true;
        this._individualAuditFieldWorkDetails = details;
        // this.updateAuditFieldWork(details);
    }

    unsetIndiviudalAuditFieldWorkDetails() {
        this._individualAuditFieldWorkDetails = null;
        this.individual_auditFieldWork_loaded = false;
    }

    setAuditFieldWorkId(id){
        this.auditFieldWorkId = id;
    }

    unsetAuditFieldWorkId(){
        this.auditFieldWorkId = null;
    }

   
    @computed
    get individualAuditFieldWorkDetails(): AmAuditFieldWork {
        return this._individualAuditFieldWorkDetails;
    }

    
    @computed
    get auditProgress(): AmAuditProgress {
        return this._auditProgress;
    }



}

export const AmAuditFieldWorkStore = new Store();