import { observable, action, computed } from "mobx-angular";
import { MsAuditSchedules, MsAuditSchedulesPaginationResponse } from "src/app/core/models/ms-audit-management/ms-audit-schedules/ms-audit-schedules";
class Store{

    @observable
    private _msAuditSchedules: MsAuditSchedules[] = [];

    @observable
    private _individualMsAuditSchedulesDetails: MsAuditSchedules;

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = 15;

    @observable
    totalItems: number = null;

    @observable
    scheduleDepartmentId: number = null;

    @observable
    from: number = null;

    @observable
    orderItem: string = '';

    @observable
    last_page: number = null;

    @observable
    editFlag: boolean = false;

    @observable
    redirectMain: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    individualLoaded: boolean = false;

    searchText: string;

    @observable
    msAuditSchedulesId: number = null;

    @observable
    path: string = '../';
    

    // form modal
    @observable
    msAuditSchedulesformModal:boolean=false;
    // **form modal

    @action
    setPath( url: string) {
        this.path = url;
    }

    @action
    clearPath() {
        this.path = '../';
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
    setMsAuditSchedules(response: MsAuditSchedulesPaginationResponse) {

        this._msAuditSchedules = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unSetMsAuditSchedules(){
        this.loaded = false;
        this.from = null;
        this.totalItems = null;
        this.currentPage = null;
        this._msAuditSchedules = [];
        this.itemsPerPage = null;
        this.orderItem='';
    }

    @computed
    get allItems(): MsAuditSchedules[] {
        return this._msAuditSchedules.slice();
    }

    @action
    setMsAuditSchedulesId(id: number) {
        this.msAuditSchedulesId = id;
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
    setIndividualMsAuditSchedulesDetails(details: MsAuditSchedules) {
        this.individualLoaded = true;
        this._individualMsAuditSchedulesDetails = details;
        this.scheduleDepartmentId=details.department.id
    }

    @action
    unsetIndividualMsAuditSchedulesDetails() {
        this.individualLoaded = false;
        this.msAuditSchedulesId=null;
        this._individualMsAuditSchedulesDetails = null;
    }
    
    @computed
    get individualMsAuditSchedulesDetails(): MsAuditSchedules {
        return this._individualMsAuditSchedulesDetails;
    }

    //**Detials

}
export const MsAuditSchedulesStore = new Store();