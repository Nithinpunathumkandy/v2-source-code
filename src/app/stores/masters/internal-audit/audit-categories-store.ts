
import { observable, action, computed } from "mobx-angular";

import { AuditCategory,AuditCategoryPaginationResponse } from 'src/app/core/models/masters/internal-audit/audit-categories';


class Store {
    @observable
    private _auditCategories: AuditCategory[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'audit_categories.created_at';

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
    setAuditCategories(response: AuditCategoryPaginationResponse) {
        

        this._auditCategories = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllAuditCategories(audit: AuditCategory[]) {
       
        this._auditCategories = audit;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): AuditCategory[] {
        
        return this._auditCategories.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getAuditCategoriesById(id: number): AuditCategory {
        return this._auditCategories.slice().find(e => e.id == id);
    }
  
}

export const AuditCategoryMasterStore = new Store();

