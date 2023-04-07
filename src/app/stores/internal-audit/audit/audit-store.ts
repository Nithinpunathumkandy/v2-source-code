

import { observable, action, computed } from "mobx-angular";

import { Audit,AuditPaginationResponse} from 'src/app/core/models/internal-audit/audit/audit';
import { Image } from "src/app/core/models/image.model";
import { Schedules} from 'src/app/core/models/internal-audit/audit-plan/audit-plan';



class Store {
    @observable
    private _audits: Audit[] = [];
    
    @observable
    private _auditsForProgram: Audit[] = [];


    @observable
    private _auditSchedule: Schedules[] = [];

    @observable
    individualAuditSchedule: Schedules;

    @observable
    schedule_id: number;

    @observable

    current_audit_id: number = null;

    $observable
    selected: number = null;

    @observable
    _auditChecklists: [] = [];

    @observable

    auditSchedules: any;


    @observable 
    loaded:boolean=false;

    @observable 
    fromProgramAuditLoaded:boolean=false;





    @observable
    individualLoaded: boolean = false;


    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'audits.id';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    preview_url: string;

    @observable
    checklist_execute_preview_url: string;

    @observable
    document_preview_available: boolean = false;

    @observable
    private _documentDetails: Image[] = [];

    @observable
    private _checklistExecuteDocumentDetails: Image[] = [];



    @observable
    last_page: number = null;

    @observable

    audit_id: number = null;

    @observable

    auditProgramId: number = null;

    @observable
    audit_report_id: number = null;


    @observable
    individualAudit: Audit;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';


    searchText: string;
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setSelected(value:number){
        this.selected = value;
    }


    @action

    setauditSchedule(res: Schedules[]){

        this._auditSchedule = res;
    }

    @action
    setAuditChecklistForAnswer(checklists){
        this._auditChecklists = checklists;
    }

    @action
    unsetAuditChecklistForAnswer(){
        this._auditChecklists = [];
    }



    @action
    clearDocumentDetails() {
        this._documentDetails = [];
        this.preview_url = null;
    }

    @action
    clearChecklistExecuteDocumentDetails() {
        this._checklistExecuteDocumentDetails = [];
        this.checklist_execute_preview_url = null;
    }
    @action
    setDocumentDetails(details: Image,url: string) {
        
            this._documentDetails.push(details);
            this.preview_url = url;
        
    }


    @action
    setChecklistExecuteDocumentDetails(details: Image,url: string) {
        
            this._checklistExecuteDocumentDetails.push(details);
            this.checklist_execute_preview_url = url;
        
    }


    @action
    unsetChecklistExecuteDocumentDetails(token?:string){
        
            var b_pos = this._checklistExecuteDocumentDetails.findIndex(e => e.token == token)
            if(b_pos != -1){
                if(this._checklistExecuteDocumentDetails[b_pos].hasOwnProperty('is_new')){
                    this._checklistExecuteDocumentDetails.splice(b_pos,1);
                }
                else{
                    this._checklistExecuteDocumentDetails[b_pos]['is_deleted'] = true;
                }
            }
            //this._brocureDetails = null;
            //this.brochure_preview_url = null;
        

       
    }




    @action
    setIndividualAudit(audits: Audit) {   
        this.individualAudit = audits;
        this.individualLoaded = true;    
    }


    @action
    unsetIndividualAudit() {   
        this.individualAudit = null;
        this.individualLoaded = false;     
    }

    @action
    setAuditId(id:number){
        this.audit_id = id;
    }

    @action
    setReportId(id:number){
        this.audit_report_id = id;
    }

    @action
    unsetDocumentDetails(token?:string){
        
            var b_pos = this._documentDetails.findIndex(e => e.token == token)
            if(b_pos != -1){
                if(this._documentDetails[b_pos].hasOwnProperty('is_new')){
                    this._documentDetails.splice(b_pos,1);
                }
                else{
                    this._documentDetails[b_pos]['is_deleted'] = true;
                }
            }
            //this._brocureDetails = null;
            //this.brochure_preview_url = null;
        

       
    }

    @action
    setAudit(response: AuditPaginationResponse) {
        

        this._audits = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }
    @action
    clearAudits(){
        this._audits=[];
        this.loaded=false;
    }

    setAuditForAuditProgram(response: AuditPaginationResponse) {
        

        this._auditsForProgram = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.fromProgramAuditLoaded = true;
       
    }

    setAllAuditForAuditProgram(response: Audit[]) {

        this._auditsForProgram = response;
        this.fromProgramAuditLoaded = true;
       
    }

    unsetAuditForAuditProgram() {
        this._auditsForProgram = [];
        this.fromProgramAuditLoaded = false;    
    }

    @action
    setAllAudit(audits: Audit[]) {
       
        this._audits = audits;
        this.loaded = true;
        
    }

    
    @computed
    get allItems(): Audit[] {
        
        return this._audits.slice();
    }

    @computed
    get allItemsForProgram(): Audit[] {
        
        return this._auditsForProgram.slice();
    }


    @computed
    get docDetails(): Image[] {
        return this._documentDetails.slice();
    }

    @computed
    get checklistExecuteDocDetails(): Image[] {
        return this._checklistExecuteDocumentDetails.slice();
    }

    @action
    getAuditById(id: number): Audit {
        return this._audits.slice().find(e => e.id == id);
    } 

    get auditDetails() : Audit{
        return this.individualAudit;
    } 

    @action
    getAuditScheduleById(id: number): Schedules {
        this.auditSchedules = this._auditSchedule.slice().find(e => e.id == id);
        return this.auditSchedules;
    }
    get auditScheduleDetails() : Schedules{
        return this.auditSchedules;
    } 

    get selectedItem():number{
        return this.selected;
    }
    
    

  
}

export const AuditStore = new Store();

