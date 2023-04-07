import { action, computed, observable } from "mobx-angular";
import { MsAditScheduleStatuses, MsAditScheduleStatusesPaginationResponse } from "src/app/core/models/masters/ms-audit-management/ms-audit-schedule-statuses";

class Store{
    @observable
    private _msAuditScheduleStatus : MsAditScheduleStatuses[] = [];

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
    orderItem: string = 'ms-audit-schedule-statuses.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    setMsAditScheduleStatus(response: MsAditScheduleStatusesPaginationResponse) {

        this._msAuditScheduleStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }
    
    @action
    unsetMsAuditMode() {
        this._msAuditScheduleStatus = [];
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




    @computed
    get msAuditModes(): MsAditScheduleStatuses[] {

        return this._msAuditScheduleStatus.slice();
    }

    @action
    getMsAuditModesById(id: number): MsAditScheduleStatuses {
        return this._msAuditScheduleStatus.slice().find(e => e.id == id);
    }

    @computed
    get allItems(): MsAditScheduleStatuses[] {        
        return this._msAuditScheduleStatus.slice();
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
}
export const MsAuditScheduleStatusMasterStore = new Store();