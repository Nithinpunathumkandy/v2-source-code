
import { observable, action, computed } from "mobx-angular";

import { ChecklistAnswersKey , ChecklistAnswersKeyPaginationResponse } from 'src/app/core/models/internal-audit/audit/checklist-answer-keys/checklist-answerkeys';

class Store {
    @observable
    private _auditChecklistAnswerKeys: ChecklistAnswersKey[] = [];


    @observable 
    loaded:boolean=false;

    @observable
    singleRiskloaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'title';

    @observable
    totalItems: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

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
    setChecklistAnswersKey(response: ChecklistAnswersKeyPaginationResponse) {
        
        this._auditChecklistAnswerKeys = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
       
    }

    @action
    setAllChecklistAnswersKey(checklistAnswerKey: ChecklistAnswersKey[]) {
       
        this._auditChecklistAnswerKeys = checklistAnswerKey;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): ChecklistAnswersKey[] {
        
        return this._auditChecklistAnswerKeys.slice();
    }

    @action
    getChecklistAnswersKeyById(id: number): ChecklistAnswersKey {
        return this._auditChecklistAnswerKeys.slice().find(e => e.id == id);
    }



}
export const ChecklistAnswersKeyStore = new Store();