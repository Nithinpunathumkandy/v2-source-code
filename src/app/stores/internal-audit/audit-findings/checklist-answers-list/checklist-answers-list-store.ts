import { observable, action, computed } from "mobx-angular";

import { ChecklistAnswersList , ChecklistAnswersListPaginationResponse } from 'src/app/core/models/internal-audit/audit-findings/checklist-answers-list/checklist-answers-list';

class Store {
    @observable
    private _checklists: ChecklistAnswersList[] = [];

    private _singleRisk: ChecklistAnswersList;

    @observable 
    loaded:boolean=false;

    @observable
    private _individualChecklistAnswers: ChecklistAnswersList;

    @observable 
    singleLoaded:boolean=false;

    @observable
    singleRiskloaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'audit_title';

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
     setAllChecklistANswersList(response: ChecklistAnswersListPaginationResponse) {
        
        this._checklists = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
         this.totalItems = response.total;
         this.loaded = true;
       
    }

    @action
    setIndividualCheckList(checklist:ChecklistAnswersList){
        this._individualChecklistAnswers = checklist;
        this.singleLoaded = true;
    }
    @action
    clearIndividualCheckList(){
        this._individualChecklistAnswers=null;
        this.singleLoaded=false;
    }

    @computed
    get checklistsDetails()  {
        return this._individualChecklistAnswers
    }

   
    @computed
    get allItems(): ChecklistAnswersList[] {
        
        return this._checklists.slice();
    }

    @action
    getChecklistANswersListById(id: number): ChecklistAnswersList {
        return this._checklists.slice().find(e => e.id == id);
    }

 


}
export const ChecklistsAnswersListStore = new Store();