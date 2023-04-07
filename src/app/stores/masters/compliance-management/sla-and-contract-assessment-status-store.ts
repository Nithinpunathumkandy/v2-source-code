import { observable, action, computed } from "mobx-angular";
import { SlaAndContractAssessmentStatus, SlaAndContractAssessmentStatusPaginationResponse } from "src/app/core/models/masters/compliance-management/sla-and-contract-assessment-status";


class Store {

    

    @observable
    private _slaAndContractAssessmentStatus: SlaAndContractAssessmentStatus[] = [];

    @observable
    SlaAndContractAssessmentStatusToTranslate:any;

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string ='sla_and_contract_assessment_status_language.created_at' ;

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

    searchTerm: string;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setSlaAndContractAssessmentStatus(response: SlaAndContractAssessmentStatusPaginationResponse) {
        

        this._slaAndContractAssessmentStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllSlaAndContractAssessmentStatus(SlaAndContractAssessmentStatus: SlaAndContractAssessmentStatus[]) {
       
        this._slaAndContractAssessmentStatus = SlaAndContractAssessmentStatus;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): SlaAndContractAssessmentStatus[] {
        
        return this._slaAndContractAssessmentStatus.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getSlaAndContractAssessmentStatusById(id: number): SlaAndContractAssessmentStatus {
        return this._slaAndContractAssessmentStatus.slice().find(e => e.id == id);
    }

    setSlaAndContractAssessmentStatusToTranslate(SlaAndContractAssessmentStatus: any){
        this.SlaAndContractAssessmentStatusToTranslate = SlaAndContractAssessmentStatus;
    }

    get getSlaAndContractAssessmentStatusToTranslate(){
        return this.SlaAndContractAssessmentStatusToTranslate;
    }
  
    @computed // Gets Subsidiary list
    get statusList(): SlaAndContractAssessmentStatus[] {
        return this._slaAndContractAssessmentStatus.slice();
    }
}

export const SlaAndContractAssessmentStatusMasterStore = new Store();

