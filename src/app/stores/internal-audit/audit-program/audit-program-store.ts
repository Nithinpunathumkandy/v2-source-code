

import { observable, action, computed } from "mobx-angular";

import { AuditProgram,AuditProgramPaginationResponse, AuditRiskRateType, SingleAuditor } from 'src/app/core/models/internal-audit/audit-program/audit-program';


class Store {
    @observable
    private _auditPrograms: AuditProgram[] = [];

    @observable
    private _auditor: SingleAuditor;

    @observable
    private _auditRiskRate: AuditRiskRateType[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    individualAuditProgram: AuditProgram;

    @observable
    individualLoaded: boolean = false;

    @observable
    riskRateLoaded: boolean = false;

    @observable
    auditProgramId: number = null;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'audit_programs.id';


    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;

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
    setAuditProgram(response: AuditProgramPaginationResponse) {
        

        this._auditPrograms = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }
    @action
    clearAuditPrograms(){
        this._auditPrograms=[];
        this.loaded=false;
    }

    @action
    setAllAuditPrograms(auditPrograms: AuditProgram[]) {
       
        this._auditPrograms = auditPrograms;
        this.loaded = true;
        
    }

    @action
    setAuditerById(auditor: SingleAuditor) {
        this._auditor = auditor;
    }

    @action
    setAuditRiskRateTpyes(auditRiskRate: AuditRiskRateType[]) {
       
        this._auditRiskRate = auditRiskRate;
        this.riskRateLoaded = true
    }

    @action
    setIndividualAuditProgram(AuditProgram: AuditProgram) {
       
        this.individualAuditProgram = AuditProgram;
        this.individualLoaded = true;
        
    }

    @action
    unsetIndividualAuditProgram() {
       
        this.individualAuditProgram = null;
        this.individualLoaded = false;  
    }

    @action
    setAuditProgramId(id: number) {
        this.auditProgramId = id;

    }
    
    @computed
    get allItems(): AuditProgram[] {
        
        return this._auditPrograms.slice();
    }

    @computed
    get riskRateTypes(): AuditRiskRateType[] {
        
        return this._auditRiskRate.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getAuditProgramById(id: number): AuditProgram {
        return this._auditPrograms.slice().find(e => e.id == id);
    }

    get singleAuditor(){
        return this._auditor;
    } 

    get individualAuditPrograms(){
        return this.individualAuditProgram;
    } 
  
  
}

export const AuditProgramMasterStore = new Store();

