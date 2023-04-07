import { observable, action, computed } from "mobx-angular";
import { AmTestPlan, AmTestPlanPaginationResponse } from "src/app/core/models/audit-management/am-audit/am-audit-test-plan";
// import { AmAudit, AmAuditPaginationResponse } from "src/app/core/models/audit-management/am-audit/am-audit";
// import { AmTestPlan, AmTestPlanPaginationResponse } from "src/app/core/models/audit-management/am-audit/am-information-request";
import { Image } from "src/app/core/models/image.model";
import { AmAuditableItemObjectives, AmAuditableItemControls, AmAuditableItemRisks } from "src/app/core/models/audit-management/am-audit-plan/am-auditable-item";
import { AmAuditProgress, AmAuditProgressResponse } from "src/app/core/models/audit-management/am-audit-field-work/am-audit-field-work";
import { MsDocumentDetails, MsDocumentsPaginationResponse } from "src/app/core/models/ms-audit-management/ms-audit-check-list/ms-audit-check-list";

// import {AuditPaginationResponse, IndividualAudit } from 'src/app/core/models/audit-management/am-audit-plan';
class Store {
    @observable
    private _auditTestPlanList = [];

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'am_testPlans.reference_code';

    @observable
    private _individualAuditTestPlanDetails: AmTestPlan;

    @observable
    individual_audit_testPlan_loaded: boolean = false;

    @observable
    private _findingProgress;

    @observable
    private progressLoaded:boolean = false;

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
    auditTestPlanId:number = null;

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
    private _clauses = [];

    @observable
    private _contents = [];

       
    @observable
    control_loaded: boolean = false;

    @observable
    risk_loaded: boolean = false;

    @observable
    objective_loaded: boolean = false;

    @observable
    ms_loaded: boolean = false;

    @observable
    individualContentLoaded: boolean = false;

    
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

    @observable
    msCurrentPage: number = 1;

    @observable
    msItemsPerPage: number = null;

    @observable
    msTotalItems: number = null;

    selectedDocuments = []

    @action
    setAuditTestPlanDetails(response: AmTestPlanPaginationResponse) {
        this._auditTestPlanList = response.data;
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
    get testPlans(){

        return this._auditTestPlanList.slice();
    }

    getAuditTestPlanById(id: number): AmTestPlan {
        let auditList;

        auditList = this._auditTestPlanList.slice().find(e => e.id == id);
        this.setIndividualAuditTestPlanDetails(auditList);
        return auditList;
    }

    @action
    setIndividualAuditTestPlanDetails(details:AmTestPlan) {
        this.individual_audit_testPlan_loaded = true;
        this._individualAuditTestPlanDetails = details;
        // this.updateAudit(details);
    }

    unsetIndiviudalTestPlanDetails() {
        this._individualAuditTestPlanDetails = null;
        this.individual_audit_testPlan_loaded = false;
    }
   
    @computed
    get individualTestPlanDetails(): AmTestPlan {
        return this._individualAuditTestPlanDetails;
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

    setAuditTestPlanId(id){
        this.auditTestPlanId = id;
    }

    unsetAuditTestPlanId(){
        this.auditTestPlanId = null;
    }

    @action
    unsetAuditTestPlanDatas(){
        this.control_loaded = false;
        this.risk_loaded = false;
        this.objective_loaded = false;
        this.ms_loaded = false;
        this._controls=[];
        this._risks =[];
        this._objectives =[];
        this._clauses =[];
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

    @action
    setDocumentVersionLists(response: MsDocumentsPaginationResponse) {
        this._clauses = response.data;
        this.msCurrentPage = response.current_page;
        this.msItemsPerPage = response.per_page;
        this.msTotalItems = response.total;
        this.ms_loaded = true;

    }

    @action
    setDocumentVersionContents(details:MsDocumentDetails[]){
      this._contents = details
      this.individualContentLoaded = true;
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

    @computed
    get msTypes() {

        return this._clauses.slice();
    }

    @computed
    get versionContents() {

        return this._contents;
    }

    @action
    unsetVersionContents(){
        this._contents = [];
        this.individualContentLoaded = false;
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

    @action
    setMsCurrentPage(current_page: number) {
        this.msCurrentPage = current_page;
    }

    @action
    setFindingProgress(response: AmAuditProgressResponse) {
        this._findingProgress = response;
        this.progressLoaded = true;
       
    }

        
    @computed
    get findingProgress(): AmAuditProgress {
        return this._findingProgress;
    }

    @action
    setSelectedDocuments(data){
        if(this.selectedDocuments.length > 0){
            let pos = this.selectedDocuments.findIndex(e=>e.id == data.id)
               if(pos != -1){
                 this.selectedDocuments.splice(pos,1)
               }else{
                 this.selectedDocuments.push({id:data.id,title:data.title,doc_id:data.doc_id?data.doc_id:null})
               }
             
           }else {
             this.selectedDocuments.push({id:data.id,title:data.title,doc_id:data.doc_id?data.doc_id:null})
           }   
    }

    checkSelectedStatus(data) {
        var pos = null;
        pos = this.selectedDocuments.findIndex(e => e.id == data.id);
        if (pos != -1) 
         return true;
         else return false;
      }

      unsetSelectedDocuments(){
          this.selectedDocuments = [];
      }
}

export const AmAuditTestPlanStore = new Store();