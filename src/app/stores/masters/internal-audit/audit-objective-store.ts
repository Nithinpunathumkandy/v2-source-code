import { observable, action, computed } from "mobx-angular";
import { AuditObjective,AuditObjectivePaginationResponse } from 'src/app/core/models/masters/internal-audit/audit-objective';


class Store {
    @observable
    private _auditObjectiveList: AuditObjective[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'audit_objectives.created_at';

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
    setAuditObjective(response: AuditObjectivePaginationResponse) {
        
        this._auditObjectiveList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllAuditObjective(audit: AuditObjective[]) {
       
        this._auditObjectiveList = audit;
        this.loaded = true;
        
    }
    @computed
    get allItems(): AuditObjective[] {
        
        return this._auditObjectiveList.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getAuditObjectiveById(id: number): AuditObjective {
        return this._auditObjectiveList.slice().find(e => e.id == id);
    }
  
}

export const AuditObjectiveMasterStore = new Store();