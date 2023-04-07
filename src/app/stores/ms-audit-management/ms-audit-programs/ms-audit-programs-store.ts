import { observable, action, computed } from "mobx-angular";
import { MsAuditPrograms, MsAuditProgramsPaginationResponse } from "src/app/core/models/ms-audit-management/ms-audit-programs/ms-audit-programs";
class Store{

    @observable
    private _msAuditPrograms: MsAuditPrograms[] = [];

    @observable
    private _individualMsAuditProgramsDetails: MsAuditPrograms;

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
    editFlag: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    individualLoaded: boolean = false;

    searchText: string;

    @observable
    msAuditProgramsId: number = null;

    @observable
    path: string = '../';
    
    @observable
    enableReport:number=0;  

    // form modal
    @observable
    msAuditCategoryformModal:boolean=false;
    // **form modal

    @action
    setPath( url: string) {
        this.path = url;
    }
    
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setMsAuditPrograms(response: MsAuditProgramsPaginationResponse) {

        this._msAuditPrograms = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unSetMsAuditPrograms(){
        this.loaded = false;
        this.from = null;
        this.totalItems = null;
        this.currentPage = null;
        this._msAuditPrograms = [];
        this.itemsPerPage = null;
        this.orderItem='';
    }

    @computed
    get allItems(): MsAuditPrograms[] {
        return this._msAuditPrograms.slice();
    }

    @action
    setMsAuditProgramsId(id: number) {
        this.msAuditProgramsId = id;
    }

    @action
    setEditFlag() {
        this.editFlag = true;
    }

    @action
    unsetEditFlag() {
        this.editFlag = false;
    }

    //*Detials
    @action
    setIndividualMsAuditPrgramsDetails(details: MsAuditPrograms) {
        this.individualLoaded = true;
        this._individualMsAuditProgramsDetails = details;
        this.enableReport= details.is_completed;

    }

    @action
    unsetIndividualMsAuditProgramsDetails() {
        this.individualLoaded = false;
        this._individualMsAuditProgramsDetails = null;
    }
    
    @computed
    get individualMsAuditProgramsDetails(): MsAuditPrograms {
        return this._individualMsAuditProgramsDetails;
    }

    //**Detials

}
export const MsAuditProgramsStore = new Store();