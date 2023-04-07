import { observable, action, computed } from "mobx-angular";

import { AuditReportStatus,AuditReportStatusPaginationResponse } from 'src/app/core/models/masters/internal-audit/audit-report-statuses';


class Store {
    @observable
    private _auditReportStatusList: AuditReportStatus[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'audit_report_statuses.created_at';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

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
    setAuditReportStatus(response: AuditReportStatusPaginationResponse) {
        
        this._auditReportStatusList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }
    @computed
    get allItems(): AuditReportStatus[] {
        
        return this._auditReportStatusList.slice();
    }
    @action
    getAuditReportStatusById(id: number): AuditReportStatus {
        return this._auditReportStatusList.slice().find(e => e.id == id);
    }
  
}

export const AuditReportStatusMasterStore = new Store();