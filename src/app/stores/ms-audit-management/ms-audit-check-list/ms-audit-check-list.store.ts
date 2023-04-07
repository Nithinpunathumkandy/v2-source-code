import { observable, action, computed } from "mobx-angular";
import { MsAuditCheckListPaginationResponse, MsauditCheckLists, MsauditCheckListsDetails, MsDocumentDetails } from "src/app/core/models/ms-audit-management/ms-audit-check-list/ms-audit-check-list";
class Store {

@observable
 _msAuditCheckLists : MsauditCheckLists[] = []
 
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

@observable
orderItem: string = '';

@observable
last_page: number = null;

@observable
orderBy: 'asc' | 'desc' = 'desc';

searchText: string;

@observable 
_msCheckListDetails : MsauditCheckListsDetails = null

@observable
individualLoaded : boolean = false;

@action
setMsAuditCheckLists(response){
    this._msAuditCheckLists = response?.data ? response?.data : response ;
    this.currentPage = response.current_page;
    this.itemsPerPage = response.per_page;
    this.totalItems = response.total;
    this.from = response.from;
    this.loaded = true;
}

@action
unsetMsAuditCheckLists(){
    this._msAuditCheckLists = [];
    this.currentPage =null;
    this.itemsPerPage = null;
    this.totalItems = null;
    this.from = null;
    this.loaded = false;
}

@action
setMsAuditCheckListDetails(details:MsauditCheckListsDetails){
  this._msCheckListDetails = details;
  this.individualLoaded = true
}

@action
unsetMsAuditCheckListDetails(){
    this._msCheckListDetails = null;
    this.individualLoaded = false
  }

@action
setCurrentPage(current_page: number) {
    this.currentPage = current_page;
}

@computed
get msAuditChecckLists() {
    return this._msAuditCheckLists
}

@computed
get msAuditCheckListDetails():MsauditCheckListsDetails {
    return this._msCheckListDetails
}

}
export const MsAuditCheckListStore = new Store()