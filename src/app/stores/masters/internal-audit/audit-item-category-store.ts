import { observable, action, computed } from "mobx-angular";

import { AuditableItemCategory,AuditableItemCategoryPaginationResponse } from 'src/app/core/models/masters/internal-audit/auditable-item-category';
class Store {
    @observable
    private _auditItemCategories: AuditableItemCategory[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'auditable_item_categories.created_at';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

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
    setAuditItemCategories(response: AuditableItemCategoryPaginationResponse) {
        
        this._auditItemCategories = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllAuditItemCategories(audit: AuditableItemCategory[]) {
       
        this._auditItemCategories = audit;
        this.loaded = true;
        
    }
    @computed
    get allItems(): AuditableItemCategory[] {
        
        return this._auditItemCategories.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getAuditItemById(id: number): AuditableItemCategory {
        return this._auditItemCategories.slice().find(e => e.id == id);
    }
  
}

export const AuditItemCategoryMasterStore = new Store();

