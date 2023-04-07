import { observable, action, computed } from "mobx-angular";
import { MsAuditPlans, MsAuditPlansPaginationResponse } from "src/app/core/models/ms-audit-management/ms-audit-plans/ms-audit-plans";

class Store{

    @observable
    private _msAuditPlans: MsAuditPlans[] = [];

    @observable
     _msAuditPrePlans: MsAuditPlans[] = [];

    @observable
    private _individualMsAuditPlansDetails: MsAuditPlans;

    @observable
    loaded: boolean = false;

    @observable
    loadedPrePlan: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    currentPagePrePlan: number = 1;

    @observable
    itemsPerPage: number = 15;

    @observable
    itemsPerPagePrePlan: number = 15;

    @observable
    totalItems: number = null;

    @observable
    totalItemsPrePlan: number = null;

    @observable
    from: number = null;

    @observable
    fromPrePlan: number = null;

    @observable
    orderItem: string = 'created_at';

    @observable
    last_page: number = null;

    @observable
    editFlag: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    individualLoaded: boolean = false;

    @observable
    redirectAuditProgram:boolean =false;

    @observable
    criteria_form_modal: boolean = false;

    @observable
    objectives_form_modal: boolean = false;

    searchText: string;

    @observable
    msAuditPlansId: number = null;

    @observable
    path: string = '../';

    @observable
    workflowType: string;

    @observable
    activity_log_form_modal:boolean=false;
    

    // form modal
    @observable
    msAuditPlanssformModal:boolean=false;
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
    setMsAuditPlans(response: MsAuditPlansPaginationResponse) {

        this._msAuditPlans = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setMsAuditPrePlans(response: MsAuditPlansPaginationResponse) {

        this._msAuditPrePlans = response.data;
        this.currentPagePrePlan = response.current_page;
        this.itemsPerPagePrePlan = response.per_page;
        this.totalItemsPrePlan = response.total;
        this.fromPrePlan = response.from;
        this.loadedPrePlan = true;
    }

    @action
    unSetMsAuditPlans(){
        this.loaded = false;
        this.from = null;
        this.totalItems = null;
        this.currentPage = null;
        this._msAuditPlans = [];
        this.itemsPerPage = null;
        this.orderItem='';
    }

    @computed
    get allItems(): MsAuditPlans[] {
        return this._msAuditPlans.slice();
    }

    @action
    setMsAuditPlansId(id: number) {
        this.msAuditPlansId = id;
    }

    // @computed
    // get selectedId(): number{
    //     return this.msAuditPlansId;
    // }

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
    setIndividualMsAuditPlansDetails(details: MsAuditPlans) {
        this.individualLoaded = true;
        this._individualMsAuditPlansDetails = details;
    }

    @action
    unsetIndividualMsAuditPlansDetails() {
        this.individualLoaded = false;
        this._individualMsAuditPlansDetails = null;
    }
    
    @computed
    get individualMsAuditPlansDetails(): MsAuditPlans {
        return this._individualMsAuditPlansDetails;
    }

    //**Detials

}
export const MsAuditPlansStore = new Store();