
import { observable, action, computed } from "mobx-angular";

import { ChecklistQuestions , ChecklistQuestionsPaginationResponse } from 'src/app/core/models/internal-audit/audit/checklist-questions/checklist-questions';

class Store {
    @observable
    private _checklistQuestions: ChecklistQuestions[] = [];


    @observable 
    loaded:boolean=false;


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
    setChecklistQuestion(response: ChecklistQuestionsPaginationResponse) {
        
        this._checklistQuestions = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
       
    }

    @action
    setAllChecklistQuestions(checklistQuestions: ChecklistQuestions[]) {
       
        this._checklistQuestions = checklistQuestions;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): ChecklistQuestions[] {
        
        return this._checklistQuestions.slice();
    }

    @action
    getChecklistQuestionsById(id: number): ChecklistQuestions {
        return this._checklistQuestions.slice().find(e => e.id == id);
    }



}
export const ChecklistQuestionsStore = new Store();