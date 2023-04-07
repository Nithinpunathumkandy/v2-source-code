import { observable, action, computed } from "mobx-angular";
import { AuditCheckList, AuditCheckListResponse } from "src/app/core/models/ms-audit-management/audit-check-list/audit-check-list";
class Store {


@observable
_auditCheckLists : AuditCheckList[] = [];

@observable
_auditCheckList : AuditCheckList[] = [];

@observable
loaded: boolean = false;

@observable
checkListLoaded: boolean = false;

@observable
currentPage: number = 1;

@observable
itemsPerPage: number = 15;

@observable
totalItems: number = null;

@observable
from: number = null;

@observable
orderItem: string = 'checklist.title';

@observable
last_page: number = null;

@observable
orderBy: 'asc' | 'desc' = 'desc';

searchText: string;

is_view_answer : number

@observable
individualLoaded : boolean = false;

@observable
selectedProcessId : number = null

@observable
defaultSelected = null;

@action
setCurrentPage(current_page: number) {
    this.currentPage = current_page;
}

@action
setMsAuditCheckLists(response : AuditCheckListResponse){
    this._auditCheckLists = response.data;
    this.currentPage = response.current_page;
    this.itemsPerPage = response.per_page;
    this.totalItems = response.total;
    this.from = response.from;
    this.loaded = true;
}

@computed
get msAuditChecckLists() {
    return this._auditCheckLists
}

@action
setAuditCheckList(response : AuditCheckListResponse){
    if(response.data.length > 0){
        let pos = response.data.findIndex(e=>e.checklist_id == null)
        if(pos != -1){
            response.data.splice(pos,1)
        }
    }
    this._auditCheckList = response.data;
    this.defaultSelected = response.data[0];
    this.checkListLoaded = true;
}

@computed
get auditChecckLists() {
    return this._auditCheckList
}

@action
setselectedProcessId(index = null, id: number = null){
        this.defaultSelected = index
        this.selectedProcessId = id
    }

@action
unsetselectedProcessId(){
    this.defaultSelected = null
    this.selectedProcessId = null
}



}
export const AuditCheckListStore = new Store()