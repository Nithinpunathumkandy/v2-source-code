
import { observable, action, computed } from "mobx-angular";

import { ComplianceSection,ComplianceSectionPaginationResponse } from 'src/app/core/models/masters/compliance-management/compliance-section';


class Store {
    @observable
    private _complianceSection: ComplianceSection[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'compliace_sections.created_at';

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
    setComplianceSection(response: ComplianceSectionPaginationResponse) {
        this._complianceSection = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true; 
    }

    @action
    setAllComplianceSection(document: ComplianceSection[]) {
        this._complianceSection = document;
        this.loaded = true;
    }

    @computed
    get allItems(): ComplianceSection[] {        
        return this._complianceSection.slice();
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
    getComplianceSectionById(id: number): ComplianceSection {
        return this._complianceSection.slice().find(e => e.id == id);
    }
  
}

export const ComplianceSectionMasterStore = new Store();

