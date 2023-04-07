import { observable, action, computed } from "mobx-angular";
import { AuditStatuses,AuditStatusesPaginationResponse } from 'src/app/core/models/masters/audit-management/audit-statuses';


class Store {
    @observable
    private _auditStatuses: AuditStatuses[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'am_audit_status_language.created_at';

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
    setAuditStatuses(response: AuditStatusesPaginationResponse) {
        this._auditStatuses = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true; 
    }

    @action
    setAllAuditStatuses(type: AuditStatuses[]) {
        this._auditStatuses = type;
        this.loaded = true;
    }

    @computed
    get allItems(): AuditStatuses[] {        
        return this._auditStatuses.slice();
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getAuditStatusesById(id: number): AuditStatuses {
        return this._auditStatuses.slice().find(e => e.id == id);
    }
  
}

export const AuditStatusesMasterStore = new Store();

