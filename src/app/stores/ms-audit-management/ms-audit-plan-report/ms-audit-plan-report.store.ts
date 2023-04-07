
import { observable, action, computed } from "mobx-angular";
import { ActivityLogPaginationResponse, AuditReport,ActivityLogs, MsAuditRiskDetails, MsAuditRiskDetailsPaginationResponse } from 'src/app/core/models/ms-audit-management/ms-audit/ms-audit-details/audit-report';

class Store{

    reportLists = [
        { 
            id: '1', 
            checkLevel: 'is_department',
            title: 'Audit Plan by department', 
            type: 'audit-plan-by-department', 
            reportType: 'riskRegister', 
            endurl: 'ms-audit-plan-count-by-departments', 
            riskItemId: 'department_ids', 
            riskTypeValue: 'title', 
            tabletiltle: 'department', 
            activityname: 'EXPORT_PROCESS_COUNT_BY_DEPARTMENTS',
            listPermission: 'EXPORT_PROCESS' 
        },
        { 
            id: '2', 
            // checkLevel: 'is_division',
            title: 'Non Confirmity by status', 
            type: 'non-confirmity-by-status', 
            reportType: 'riskRegister', 
            endurl: 'ms-audit-finding-count-by-statuses', 
            riskItemId: 'ms_audit_finding_status_ids', 
            riskTypeValue: 'title', 
            tabletiltle: 'status', 
            activityname: 'EXPORT_PROCESS_COUNT_BY_DIVISIONS',
            listPermission: 'EXPORT_PROCESS'
        },
        // { 
        //     id: '3', 
        //     title: 'Audit Plan Count By Status', 
        //     type: 'audit-plan-count-by-status', 
        //     reportType: 'riskRegister', 
        //     endurl: 'ms-audit-plan-count-by-statuses', 
        //     riskItemId: 'audit-plan-count-by-status', 
        //     riskTypeValue: 'title', 
        //     tabletiltle: 'status', 
        //     activityname: 'EXPORT_PROCESS_COUNT_BY_CATEGORIES',
        //     listPermission: 'EXPORT_PROCESS' 
        // },
        { 
            id: '4', 
            title: 'Audit Plan Count By Lead Auditors', 
            type: 'audit-plan-count-by-lead-auditors', 
            reportType: 'riskRegister', 
            endurl: 'ms-audit-plan-count-by-lead-auditors', 
            riskItemId: 'ms_lead_auditor_ids', 
            riskTypeValue: 'first_name', 
            riskTypeValue2 : 'last_name',
            tabletiltle: 'Lead Auditors', 
            activityname: 'EXPORT_PROCESS_COUNT_BY_GROUPS',
            listPermission: 'EXPORT_PROCESS' 
        },
        { 
            id: '5', 
            title: 'Audit Count By Auditors', 
            type: 'audit-count-by-auditors', 
            reportType: 'riskRegister', 
            endurl: 'ms-audit-count-by-auditors', 
            riskItemId: 'ms_auditor_ids', 
            riskTypeValue: 'first_name', 
            riskTypeValue2 : 'last_name',
            tabletiltle: 'auditors', 
            activityname: 'EXPORT_PROCESS_COUNT_BY_INTERNAL_STAKEHOLDERS',
            listPermission: 'EXPORT_PROCESS' 
        },
    ];
    @observable
    private _activityLogs: ActivityLogs[] = [];

    @observable
    private _auditDetails:any=null
  
    @observable
    listloaded: boolean = false;

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

    @observable
    selectedReportObject: AuditReport = null;

    @observable
    private _auditReportsList: AuditReport[] = [];

    @observable
    private _msAuditRiskCountDetails: MsAuditRiskDetails[] = [];

    @observable
    private _auditCountDetails:[] = [];

    @observable
    reportloaded: boolean = false;

    @observable
    auditRiskListingTableTitle: string;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    externalRisktlistmakeEmpty() {
        this._msAuditRiskCountDetails = [];
        this.listloaded = false;
    }

    @action
    setExternalRiskCountDetails(response: MsAuditRiskDetailsPaginationResponse) {
        this._msAuditRiskCountDetails = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.listloaded = true;
    }

    @action
    setAuditPlanReport(details: any,noData:boolean) {
    
            this.loaded = true;
            this._auditDetails = details;
    }

    @action
    clearAuditPlanReport() {
        this.loaded = false;
        this._auditDetails = null;
    }

    @action
    setAuditRiskListingTableTitle(auditRiskListingTableTitle: string) {
        console.log(auditRiskListingTableTitle);
        this.auditRiskListingTableTitle = this.selectedReportObject?.title +' '+ auditRiskListingTableTitle+' ';
    }

    @computed
    get AuditRiskListingTableTitle(): string {
        
        return this.auditRiskListingTableTitle;
    }
    
    @computed
    get AuditPlanReportDetails(): any {
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
    setAuditCountDetails(response) {
        this._auditCountDetails = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.listloaded = true;
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
    get AuditReportListArray() {

        return this.reportLists;
    }

    @computed
    get allItems(): AuditReport[] {

        return this._auditReportsList.slice();
    }
    @computed
    get AuditItemsDetails(){

        return this._auditCountDetails.slice();
    }

    @action
    auditReportlistmakeEmpty() {
        this._auditReportsList = [];
        this.reportloaded = false;
    }

    @action
    setAuditRiskDetails(response: any) {
        this._auditReportsList = response;
        this.reportloaded = true;
    }

    @action
    auditRisktlistmakeEmpty() {
        this._auditCountDetails = [];
        this.listloaded = false;
    }

    @computed
    get msAuditRiskItemsDetails(): MsAuditRiskDetails[] {

        return this._msAuditRiskCountDetails.slice();
    }


}
export const AuditPlanReportStore =new Store();