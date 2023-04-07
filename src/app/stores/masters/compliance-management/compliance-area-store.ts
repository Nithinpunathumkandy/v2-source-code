
import { observable, action, computed } from "mobx-angular";

import { ComplianceArea,ComplianceAreaPaginationResponse } from 'src/app/core/models/masters/compliance-management/compliance-area';


class Store {
    @observable
    private _complianceArea: ComplianceArea[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'compliance_areas.created_at';

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
    setComplianceArea(response: ComplianceAreaPaginationResponse) {
        this._complianceArea = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true; 
    }

    @action
    setAllComplianceArea(document: ComplianceArea[]) {
        this._complianceArea = document;
        this.loaded = true;
    }

    @computed
    get allItems(): ComplianceArea[] {        
        return this._complianceArea.slice();
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    get LastInsertedId():number{
        if(this.lastInsertedId) 
            return this.lastInsertedId;
        else 
            return null;
    }

    @action
    getComplianceAreaById(id: number): ComplianceArea {
        return this._complianceArea.slice().find(e => e.id == id);
    }
  
}

export const ComplianceAreaMasterStore = new Store();

