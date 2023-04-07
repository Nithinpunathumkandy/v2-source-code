import { observable, action, computed } from "mobx-angular";
import { AuditCheckListAnswerKey, AuditCheckListAnswerKeyPaginationResponse } from "src/app/core/models/masters/internal-audit/audit-checklist-answer-key";


class Store {

    @observable
    private _auditCheckListAnswerKey: AuditCheckListAnswerKey[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'audit_checklist_answer_keys.created_at';

    @observable
    from: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

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
    setAuditCheckListAnswerKey(response: AuditCheckListAnswerKeyPaginationResponse) {
        
        this._auditCheckListAnswerKey = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @computed
    get allItems(): AuditCheckListAnswerKey[] {
        
        return this._auditCheckListAnswerKey.slice();
    }


}

export const AuditCheckListAnswerKeyMasterStore = new Store();