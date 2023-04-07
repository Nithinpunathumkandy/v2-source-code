
import { observable, action, computed } from "mobx-angular";

import { AuditCategory,AuditCategoryPaginationResponse } from 'src/app/core/models/masters/audit-management/am-audit-category';


class Store {
    @observable
    private _auditCategory: AuditCategory[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'am_audit_categories.created_at';

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
    setAuditCategory(response: AuditCategoryPaginationResponse) {
        this._auditCategory = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true; 
    }

    @action
    setAllAuditCategory(type: AuditCategory[]) {
        this._auditCategory = type;
        this.loaded = true;
    }

    @computed
    get allItems(): AuditCategory[] {        
        return this._auditCategory.slice();
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
    getAuditCategoryById(id: number): AuditCategory {
        return this._auditCategory.slice().find(e => e.id == id);
    }
  
}

export const AmAuditCategoryMasterStore = new Store();

