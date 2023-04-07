import { observable, action, computed } from "mobx-angular";
import { ComplianceReportingStatus, ComplianceReportingStatusPaginationResponse } from "src/app/core/models/masters/compliance-management/compliance-reporting";


class Store {

    

    @observable
    private _complianceReportingStatus: ComplianceReportingStatus[] = [];

    @observable
    ComplianceReportingStatusToTranslate:any;

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string ='compliance_status_language.created_at' ;

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
    setComplianceReportingStatus(response: ComplianceReportingStatusPaginationResponse) {
        

        this._complianceReportingStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllComplianceReportingStatus(ComplianceReportingStatus: ComplianceReportingStatus[]) {
       
        this._complianceReportingStatus = ComplianceReportingStatus;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): ComplianceReportingStatus[] {
        
        return this._complianceReportingStatus.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getComplianceReportingStatusById(id: number): ComplianceReportingStatus {
        return this._complianceReportingStatus.slice().find(e => e.id == id);
    }

    setComplianceReportingStatusToTranslate(ComplianceReportingStatus: any){
        this.ComplianceReportingStatusToTranslate = ComplianceReportingStatus;
    }

    get getComplianceReportingStatusToTranslate(){
        return this.ComplianceReportingStatusToTranslate;
    }
  
    @computed // Gets Subsidiary list
    get statusList(): ComplianceReportingStatus[] {
        return this._complianceReportingStatus.slice();
    }
}

export const ComplianceReportingStatusMasterStore = new Store();

