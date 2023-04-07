import { observable, action, computed } from "mobx-angular";
import { MsAuditStatuses, MsAuditStatusesPaginationResponse } from "src/app/core/models/masters/ms-audit-management/ms-audit-statuses";

//models

class Store {
    @observable
    private _msAuditStatuses: MsAuditStatuses[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    lastInsertedId: number = null;

    @observable
    orderItem: string = 'ms_audit_statuses.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    individualLoaded: boolean = false;

    // @observable
    // individualMsAuditMode: MsAuditModeSingle;
    
    searchText: string;

    @observable
    selectedMsAuditStatusesList: MsAuditStatuses[] = [];

    @observable
    saveSelected: boolean = false;
    @action
    setMsAuditStatuses(response: MsAuditStatusesPaginationResponse) {

        this._msAuditStatuses = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unsetMsAuditStatuses() {
        this._msAuditStatuses = [];
        this.loaded = false;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    // @action
    // setIndividualMsAuditCategory(auditMode: MsAuditModeSingle) {
       
    //     this.individualMsAuditMode = auditMode;
    //     this.individualLoaded = true;
        
    // }
    // get individualMsAuditModeId(){
    //     return this.individualMsAuditMode;
    // } 

    @computed
    get msAuditStatuses(): MsAuditStatuses[] {

        return this._msAuditStatuses.slice();
    }

    @action
    getMsAuditStatusesById(id: number): MsAuditStatuses {
        return this._msAuditStatuses.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedId(id: number) {
        this.lastInsertedId = id;
    }

    get LastInsertedId(): number {
        if (this.lastInsertedId)
            return this.lastInsertedId;
        else
            return null;
    }

    @action
    addSelectedMsAuditStatuses(issues){
        this.selectedMsAuditStatusesList = issues;
    }

    unsetSelectedMsAuditModes(){
        this.selectedMsAuditStatusesList = [];
    }
}

export const MsAuditStatusesMasterStore = new Store();