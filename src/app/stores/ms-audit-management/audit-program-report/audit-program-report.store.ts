
import { observable, action, computed } from "mobx-angular";
import { ActivityLogs, AuditReport, ActivityLogPaginationResponse } from "src/app/core/models/ms-audit-management/audit-program-report/audit-program-report";

class Store{

    @observable
    private _activityLogs: ActivityLogs[] = [];

    @observable
    private _auditDetails:AuditReport=null


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
    searchText:string='';

    @observable
    orderItem: string = '';

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    reportId:number;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }



    @action
    setAuditReport(details: AuditReport,noData:boolean) {
        if(noData){
            this.loaded = true;
            this._auditDetails = null;
        }
        else{
            this.loaded = true;
            this._auditDetails = details;
        }
    }

    @action
    clearAuditReport() {
        this.loaded = false;
        this._auditDetails = null;
    }
    
    @computed
    get AuditReportDetails(): AuditReport {
        return this._auditDetails;
    }

    @action
    setActivityLogs(response: ActivityLogPaginationResponse) {

        this._activityLogs = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unSetActivityLogs(){
        this.loaded = false;
        this.from = null;
        this.totalItems = null;
        this.currentPage = null;
        this._activityLogs = [];
        this.itemsPerPage = null;
    }

    @computed
    get allItems(): ActivityLogs[] {
        return this._activityLogs.slice();
    }

}
export const AuditProgramReportStore =new Store();