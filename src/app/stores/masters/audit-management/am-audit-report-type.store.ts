import { observable, action, computed } from "mobx-angular";
import { AmAuditReportType, AmAuditReportTypePaginationResponse } from "src/app/core/models/masters/audit-management/am-audit-report-type";

class Store {
    @observable
    private _amAuditReportType: AmAuditReportType[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'am_audit_report_type.created_at';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;
    
    searchText: string;
    
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setAuditReportType(response: AmAuditReportTypePaginationResponse) {
        this._amAuditReportType = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true; 
    }

    @action
    setAllAnnualPlanFrequencyItem(type: AmAuditReportType[]) {
        this._amAuditReportType = type;
        this.loaded = true;
    }

    @computed
    get allItems(): AmAuditReportType[] {        
        return this._amAuditReportType.slice();
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getAnnualPlanFrequencyItemById(id: number): AmAuditReportType {
        return this._amAuditReportType.slice().find(e => e.id == id);
    }
}

export const AmAuditReportTypeMasterStore = new Store();