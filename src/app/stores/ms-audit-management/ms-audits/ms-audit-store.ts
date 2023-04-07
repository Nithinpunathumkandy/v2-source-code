import { action, computed, observable } from "mobx-angular";
import { MsAudit, MsAuditDetails, MsAuditPaginationResponse } from "src/app/core/models/ms-audit-management/ms-audit/ms-audit";

class Store{

    @observable
    private _msAudit: MsAudit[] = [];

    @observable
    private _individualMsAuditDetails: MsAuditDetails;

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = 15;

    @observable
    totalItems: number = null;

    @observable
    activity_log_form_modal: boolean = false;

    @observable
    from: number = null;

    @observable
    orderItem: string = '';

    @observable
    last_page: number = null;

    @observable
    editFlag: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    hideSubMenu: boolean = false;

    @observable
    individualLoaded: boolean = false;

    searchText: string;

    @observable
    msAuditId: number = null;
   

    @observable
    msAuditsformModal:boolean=false;

    @observable
    scheduleRedirect:boolean=false;

    @observable
    markAuditModalForm:boolean = false;
    
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setMsAudit(response: MsAuditPaginationResponse) {

        this._msAudit = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unSetMsAudit(){
        this.loaded = false;
        this.from = null;
        this.totalItems = null;
        this.currentPage = null;
        this._msAudit = [];
        this.itemsPerPage = null;
    }

    @computed
    get allItems(): MsAudit[] {
        return this._msAudit.slice();
    }

    @action
    setSubMenuHide(value:boolean){
        this.hideSubMenu = value
    }

    @computed
    get tabHides(){
        return this.hideSubMenu;
    }

 
 @action
 setIndividualMsAuditDetails(details: MsAuditDetails) {
     this.individualLoaded = true;
     this._individualMsAuditDetails = details;
 }

 @action
 unsetIndividualMsAuditDetails() {
     this.individualLoaded = false;
     this._individualMsAuditDetails = null;
 }
 
 @computed
 get individualMsAuditDetails(): MsAuditDetails {
     return this._individualMsAuditDetails;
 }

 @action
 setMsAuditId(id: number) {
     this.msAuditId = id;
 }

 @computed
 get selectedMsAuditId(){
     return this.msAuditId
 }

    // for mapping

    @observable
    select_mapping_form_modal: boolean = false;

    @observable
    saveSelected: boolean = false;

    @observable
    selectedItmesForMapping:MsAudit[]=[];

    addSelecteditems(items){
        this.selectedItmesForMapping = items;
    }

    // **for mapping


}
export const MsAuditStore = new Store();