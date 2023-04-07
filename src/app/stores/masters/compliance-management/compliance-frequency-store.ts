
import { observable, action, computed } from "mobx-angular";

import { ComplianceFrequency,ComplianceFrequencyPaginationResponse } from 'src/app/core/models/masters/compliance-management/compliance-frequency';


class Store {
    @observable
    private _complianceFrequency: ComplianceFrequency[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'compliace_frequency_language.created_at';

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
    setComplianceFrequency(response: ComplianceFrequencyPaginationResponse) {
        this._complianceFrequency = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true; 
    }

    @action
    setAllComplianceFrequency(document: ComplianceFrequency[]) {
        this._complianceFrequency = document;
        this.loaded = true;
    }

    @computed
    get allItems(): ComplianceFrequency[] {        
        return this._complianceFrequency.slice();
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getComplianceFrequencyById(id: number): ComplianceFrequency {
        return this._complianceFrequency.slice().find(e => e.id == id);
    }
  
}

export const ComplianceFrequencyMasterStore = new Store();

