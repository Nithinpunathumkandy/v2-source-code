import { observable, action, computed } from "mobx-angular";
// import { AmFinding, AmFindingPaginationResponse } from "src/app/core/models/audit-management/am-audit/am-audit-finding";
// import { AmAudit, AmAuditPaginationResponse } from "src/app/core/models/audit-management/am-audit/am-audit";
// import { AmFinding, AmFindingPaginationResponse } from "src/app/core/models/audit-management/am-audit/am-information-request";
import { Image } from "src/app/core/models/image.model";
import { AmAuditableItemObjectives, AmAuditableItemControls, AmAuditableItemRisks } from "src/app/core/models/audit-management/am-audit-plan/am-auditable-item";
import { AmFinding, AmFindingPaginationResponse } from "src/app/core/models/audit-management/am-audit-finding/am-audit-finding";

// import {AuditPaginationResponse, IndividualAudit } from 'src/app/core/models/audit-management/am-audit-plan';
class Store {
    @observable
    private _auditFindingList = [];

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'am_findings.reference_code';

    @observable
    private _individualAuditFindingDetails: AmFinding;

    @observable
    individual_audit_finding_loaded: boolean = false;

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
    auditFindingId:number = null;

    @observable
    view_more: boolean = false;

    @observable
    lastInsertedId:number = null;

    @observable
    preview_url: string;

    @observable
    private _documentDetails: Image[] = [];

    
    @observable
    private _controls = [];

    @observable
    private _risks = [];

    @observable
    private _objectives = [];

       
    @observable
    control_loaded: boolean = false;

    @observable
    risk_loaded: boolean = false;

    @observable
    objective_loaded: boolean = false;

    
    @observable
    controlCurrentPage: number = 1;

    @observable
    controlItemsPerPage: number = null;

    @observable
    controlTotalItems: number = null;

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
  findingComponent: string;


    @action
    setAuditFindingDetails(response: AmFindingPaginationResponse) {
        this._auditFindingList = response.data;
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
    get findings(){

        return this._auditFindingList.slice();
    }

    getAuditFindingById(id: number): AmFinding {
        let auditList;

        auditList = this._auditFindingList.slice().find(e => e.id == id);
        this.setIndividualAuditFindingDetails(auditList);
        return auditList;
    }

    @action
    setIndividualAuditFindingDetails(details:AmFinding) {
        this.individual_audit_finding_loaded = true;
        this._individualAuditFindingDetails = details;
        // this.updateAudit(details);
    }

    unsetIndiviudalAuditDetails() {
        this._individualAuditFindingDetails = null;
        this.individual_audit_finding_loaded = false;
    }
   
    @computed
    get individualFindingDetails(): AmFinding {
        return this._individualAuditFindingDetails;
    }


    @computed
    get docDetails(): Image[] {
        return this._documentDetails.slice();
    }

    @action
    setDocumentDetails(details: Image, url: string) {

        this._documentDetails.push(details);
        this.preview_url = url;

    }

    @action
    unsetDocumentDetails(token?: string) {

        var b_pos = this._documentDetails.findIndex(e => e.token == token)
        if (b_pos != -1) {
            if (this._documentDetails[b_pos].hasOwnProperty('is_new')) {
                this._documentDetails.splice(b_pos, 1);
            }
            else {
                this._documentDetails[b_pos]['is_deleted'] = true;
            }
        }
    }

    @action
    clearDocumentDetails() {
        this._documentDetails = [];
        this.preview_url = null;
    }

    setAuditFindingId(id){
        this.auditFindingId = id;
    }

    unsetAuditFindingId(){
        this.auditFindingId = null;
    }

    
    @action
    setAuditableItemControls(response: AmAuditableItemControls) {
        this._controls = response.data;
        this.controlCurrentPage = response.current_page;
        this.controlItemsPerPage = response.per_page;
        this.controlTotalItems = response.total;
        this.control_loaded = true;

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

    
    @computed
    get controls() {

        return this._controls.slice();
    }

    @computed
    get risks() {

        return this._risks.slice();
    }

    @computed
    get objectives() {

        return this._objectives.slice();
    }

    
    @action
    setControlCurrentPage(current_page: number) {
        this.controlCurrentPage = current_page;
    }

    
    @action
    setRiskCurrentPage(current_page: number) {
        this.riskCurrentPage = current_page;
    }

    
    @action
    setObjectiveCurrentPage(current_page: number) {
        this.objectiveCurrentPage = current_page;
    }




}

export const AmAuditFindingStore = new Store();