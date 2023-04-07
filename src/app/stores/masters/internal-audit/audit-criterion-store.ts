import { observable, action, computed } from "mobx-angular";

import { AuditCriterion,AuditCriterionPaginationResponse } from 'src/app/core/models/masters/internal-audit/audit-criterion';


class Store {
    @observable
    private _auditCriterionList: AuditCriterion[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'audit_criteria.created_at';

    @observable
    from: number = null;

    @observable
    totalItems: number = null;

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
    setAuditCriteria(response: AuditCriterionPaginationResponse) {
        
        this._auditCriterionList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllAuditCriteria(audit: AuditCriterion[]) {
       
        this._auditCriterionList = audit;
        this.loaded = true;
        
    }
    @computed
    get allItems(): AuditCriterion[] {
        
        return this._auditCriterionList.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getAuditCriteriaById(id: number): AuditCriterion {
        return this._auditCriterionList.slice().find(e => e.id == id);
    }
  
}

export const AuditCriterionMasterStore = new Store();


