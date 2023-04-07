import { observable, action, computed } from "mobx-angular";

import { ComplianceStatus, ComplianceStatusPaginationResponse } from 'src/app/core/models/masters/compliance-management/compliance-status';


class Store {

    

    @observable
    private _complianceStatus: ComplianceStatus[] = [];

    @observable
    ComplianceStatusToTranslate:any;

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
    setComplianceStatus(response: ComplianceStatusPaginationResponse) {
        

        this._complianceStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllComplianceStatus(complianceStatus: ComplianceStatus[]) {
       
        this._complianceStatus = complianceStatus;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): ComplianceStatus[] {
        
        return this._complianceStatus.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getComplianceStatusById(id: number): ComplianceStatus {
        return this._complianceStatus.slice().find(e => e.id == id);
    }

    setComplianceStatusToTranslate(complianceStatus: any){
        this.ComplianceStatusToTranslate = complianceStatus;
    }

    get getComplianceStatusToTranslate(){
        return this.ComplianceStatusToTranslate;
    }
  
    @computed // Gets Subsidiary list
    get statusList(): ComplianceStatus[] {
        return this._complianceStatus.slice();
    }
}

export const ComplianceStatusMasterStore = new Store();

