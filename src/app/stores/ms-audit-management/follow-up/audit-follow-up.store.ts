import { NgbCalendarIslamicCivil } from "@ng-bootstrap/ng-bootstrap";
import { observable, action, computed } from "mobx-angular";
import { AuditCheckList } from "src/app/core/models/ms-audit-management/audit-check-list/audit-check-list";
import { AuditCorrectiveAcctionDetails, AuditCorrectiveActionHistory, AuditCorrectiveActionHistoryResponse, AuditCorrectiveActionResponse, AuditCorrectiveActions } from "src/app/core/models/ms-audit-management/ms-audit/ms-audit-details/audit-follow-up";

class Store {
    @observable
    _auditCorrectiveActions : AuditCorrectiveActions[] = [];

    @observable
    _auditCorrectiveActionHistory : AuditCorrectiveActionHistory[] = [];
    
    @observable
    loaded: boolean = false;
    
    @observable
    currentPage: number = 1;
    
    @observable
    itemsPerPage: number = 15;
    
    @observable
    totalItems: number = null;
    
    @observable
    from: number = null;

    // history
    @observable
    loadedHistory: boolean = false;
    
    @observable
    currentPageHistory: number = 1;
    
    @observable
    itemsPerPageHistory: number = 15;
    
    @observable
    totalItemsHistory: number = null;
    
    @observable
    fromHistory: number = null;
    
    @observable
    orderItem: string = '';
    
    @observable
    last_page: number = null;
    
    @observable
    orderBy: 'asc' | 'desc' = 'desc';
    
    searchText: string;

    @observable
    _actionPlans = []

    @observable
    _correcetiveActionDetails : AuditCorrectiveAcctionDetails = null;

    @observable
    individualCorrectiveActionLoaded: boolean = false;

    @observable
    is_alreadyExist: boolean = false;


    @action
setCurrentPage(current_page: number) {
    this.currentPage = current_page;
}

setActionPlans(data,ind){
    if(ind != null){
       this._actionPlans[ind] = data
    }else {
        let pos = this._actionPlans.findIndex(e=> e.title == data.title)
           if(pos != -1){
               this.is_alreadyExist = true
           }else {
            this._actionPlans.push(data)
            this.is_alreadyExist = false;

           }
    }
}

@action
setMsAuditCorrectiveActions(response : AuditCorrectiveActionResponse){
    this._auditCorrectiveActions = response.data;
    this.currentPage = response.current_page;
    this.itemsPerPage = response.per_page;
    this.totalItems = response.total;
    this.from = response.from;
    this.loaded = true;
}

@action
setMsAuditCorrectiveActionHistory(response : AuditCorrectiveActionHistoryResponse){
    this._auditCorrectiveActionHistory = response.data;
    this.currentPageHistory = response.current_page;
    this.itemsPerPageHistory = response.per_page;
    this.totalItemsHistory = response.total;
    this.fromHistory = response.from;
    this.loadedHistory = true;
}

@action
unsetMsAuditCorrectiveActionHistory(){
    this._auditCorrectiveActionHistory = null;
    this.currentPageHistory = null;
    this.itemsPerPageHistory = null;
    this.totalItemsHistory = null;
    this.fromHistory = null;
    this.loadedHistory = false;
}

@action
setCorrectiveActionDetails(data : AuditCorrectiveAcctionDetails){
    this._correcetiveActionDetails = data
    this.individualCorrectiveActionLoaded = true

}
@action
deleteActionPlan(action){
   let pos = this._actionPlans.findIndex(e=>e.title == action.title) 
   if(pos!= -1){
       this._actionPlans.splice(pos,1)
   }
}

@computed
get actionPlans() {
    return this._actionPlans
}

@computed
get auditCorrectiveActionDetails() {
    return this._correcetiveActionDetails
}

// @action
// unsetCorrectiveActionDetails(){
//     this._correcetiveActionDetails = null
//     this.IndividualCorrectiveActionLoaded = false
// }

@computed
get msAuditCorrectiveActions() {
    return this._auditCorrectiveActions
}

@computed
get msAuditCorrectiveActionHistory() {
    return this._auditCorrectiveActionHistory
}
}
export const AuditFollowUpStore = new Store()