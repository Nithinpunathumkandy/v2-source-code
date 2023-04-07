import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { MsAuditMode, MsAuditModePaginationResponse, MsAuditModeSingle } from "src/app/core/models/masters/ms-audit-management/ms-audit-mode";

//models

class Store {
    @observable
    private _msAuditModes: MsAuditMode[] = [];

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
    orderItem: string = 'ms_audit_mode.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    individualLoaded: boolean = false;

    @observable
    individualMsAuditMode: MsAuditModeSingle;
    
    searchText: string;

    @observable
    selectedMsAuditCategoryList: MsAuditMode[] = [];

    @observable
    saveSelected: boolean = false;
    @action
    setMsAuditMode(response: MsAuditModePaginationResponse) {

        this._msAuditModes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unsetMsAuditMode() {
        this._msAuditModes = [];
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

    @action
    setIndividualMsAuditCategory(auditMode: MsAuditModeSingle) {
       
        this.individualMsAuditMode = auditMode;
        this.individualLoaded = true;
        
    }
    get individualMsAuditModeId(){
        return this.individualMsAuditMode;
    } 

    @computed
    get msAuditModes(): MsAuditMode[] {

        return this._msAuditModes.slice();
    }

    @action
    getMsAuditModesById(id: number): MsAuditMode {
        return this._msAuditModes.slice().find(e => e.id == id);
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
    addSelectedMsAuditModes(issues){
        this.selectedMsAuditCategoryList = issues;
    }

    unsetSelectedMsAuditModes(){
        this.selectedMsAuditCategoryList = [];
    }
}

export const MsAuditModesMasterStore = new Store();