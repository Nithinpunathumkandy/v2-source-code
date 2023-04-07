import { observable, action, computed } from "mobx-angular";

import { AuditFindingCategory,AuditFindingCategoryPaginationResponse } from 'src/app/core/models/masters/external-audit/audit-finding-categories';


class Store {
    @observable
    private _auditFindingCategoryList: AuditFindingCategory[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'finding-categories.created_at';

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
    setAuditFindingCategory(response: AuditFindingCategoryPaginationResponse) {
        
        this._auditFindingCategoryList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }
    

    @action
    setAllAuditFindingCategory(audit: AuditFindingCategory[]) {
       
        this._auditFindingCategoryList = audit;
        this.loaded = true;
        
    }
    @computed
    get allItems(): AuditFindingCategory[] {
        
        return this._auditFindingCategoryList.slice();
    }

    @action
    getAuditFindingCategoryById(id: number): AuditFindingCategory {
        return this._auditFindingCategoryList.slice().find(e => e.id == id);
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
  
}

export const AuditFindingCategoryMasterStore = new Store();


