
import { observable, action, computed } from "mobx-angular";

import { AuditReport,AuditReportPaginationResponse } from 'src/app/core/models/internal-audit/report/audit-report';


class Store {
    @observable
    private _auditReports: AuditReport[] = [];

    @observable 
    loaded:boolean=false;

    @observable 
    individualLoaded:boolean=false;

    @observable
    private _invidualReport: AuditReport;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'audit-reports.title';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

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
    setAuditReports(response: AuditReportPaginationResponse) {
        

        this._auditReports = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
     clearAuditReorts(){
         this._auditReports=[];
         this.loaded=false;
     }

    @action
    setInvidualReport(res:AuditReport){
        this._invidualReport = res;
        this.individualLoaded = true;
    }

    @action
    setAllAuditReports(auditReports: AuditReport[]) {
       
        this._auditReports = auditReports;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): AuditReport[] {
        
        return this._auditReports.slice();
    }

    @computed
    get reportDetails() {
        
        return this._invidualReport;
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

}

export const AuditReportsStore = new Store();

