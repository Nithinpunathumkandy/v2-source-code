
import { observable, action, computed } from "mobx-angular";
import { ActivityLogPaginationResponse, CyberReport,ActivityLogs, CyberRiskDetails, CyberRiskDetailsPaginationResponse } from 'src/app/core/models/cyber-incident/cyber-incident-report';

class Store{

    reportLists = [
        { 
            id: '1', 
            checkLevel: 'is_department',
            title: 'cyber_incident_by_statuses',
            type: 'cyber-incident-by-statuses', 
            reportType: 'riskRegister', 
            endurl: 'cyber-incident-by-statuses', 
            riskItemId: 'cyber_incident_by_status_ids', 
            riskTypeValue: 'title', 
            tabletitle: 'Status', 
            activityname: 'EXPORT_PROCESS_COUNT_BY_DEPARTMENTS',
            listPermission: 'EXPORT_PROCESS' 
        },
        { 
            id: '2', 
            // checkLevel: 'is_division',
            title: 'cyber_incident_by_classification', 
            type: 'cyber-incident-by-classification', 
            reportType: 'riskRegister', 
            endurl: 'cyber-incident-by-classification', 
            riskItemId: 'cyber_incident_classification_ids', 
            riskTypeValue: 'title', 
            tabletitle: 'Classification', 
            activityname: 'EXPORT_PROCESS_COUNT_BY_DIVISIONS',
            listPermission: 'EXPORT_PROCESS'
        },
        { 
            id: '3', 
            title: 'cyber_incident_by_department', 
            type: 'cyber-incident-by-department', 
            reportType: 'riskRegister', 
            endurl: 'cyber-incident-by-department', 
            riskItemId: 'department_ids', 
            riskTypeValue: 'title', 
            tabletitle: 'Department', 
            activityname: 'EXPORT_PROCESS_COUNT_BY_CATEGORIES',
            listPermission: 'EXPORT_PROCESS' 
        },
        { 
            id: '4', 
            title: 'corrective_action_by_corrective_action_statuses', 
            type: 'corrective-action-by-corrective-action-statuses', 
            reportType: 'riskRegister', 
            endurl: 'corrective-action-by-corrective-action-statuses', 
            riskItemId: 'cyber_incident_corrective_action_status_ids', 
            riskTypeValue: 'title', 
            tabletitle: 'Status', 
            activityname: 'EXPORT_PROCESS_COUNT_BY_GROUPS',
            listPermission: 'EXPORT_PROCESS' 
        },
        // { 
        //     id: '5', 
        //     title: 'audit_count_by_auditors', 
        //     type: 'audit-count-by-auditors', 
        //     reportType: 'riskRegister', 
        //     endurl: 'ms-audit-count-by-auditors', 
        //     riskItemId: 'ms_auditor_ids', 
        //     riskTypeValue: 'first_name', 
        //     riskTypeValue2 : 'last_name',
        //     tabletiltle: 'auditors', 
        //     activityname: 'EXPORT_PROCESS_COUNT_BY_INTERNAL_STAKEHOLDERS',
        //     listPermission: 'EXPORT_PROCESS' 
        // },

        // { 
        //     id: '6', 
        //     title: 'finding_count_by_department', 
        //     type: 'finding-count-by-departments', 
        //     reportType: 'riskRegister', 
        //     endurl: 'ms-audit-finding-count-by-departments', 
        //     riskItemId: 'department_ids', 
        //     riskTypeValue: 'title', 
        //     //riskTypeValue2 : 'count',
        //     tabletiltle: 'department', 
        //     activityname: 'EXPORT_PROCESS_COUNT_BY_INTERNAL_STAKEHOLDERS',
        //     listPermission: 'EXPORT_PROCESS' 
        // },

        // { 
        //     id: '6', 
        //     title: 'corrective_action_count_by_department', 
        //     type: 'corrective-action-count-by-departments', 
        //     reportType: 'riskRegister', 
        //     endurl: 'ms-audit-finding-corrective-action-count-by-departments', 
        //     riskItemId: 'department_ids', 
        //     riskTypeValue: 'title', 
        //     //riskTypeValue2 : 'count',
        //     tabletiltle: 'department', 
        //     activityname: 'EXPORT_PROCESS_COUNT_BY_INTERNAL_STAKEHOLDERS',
        //     listPermission: 'EXPORT_PROCESS' 
        // },

        // { 
        //     id: '7', 
        //     title: 'ca_delay_count_by_department', 
        //     type: 'corrective-action-delay-count-by-departments', 
        //     reportType: 'riskRegister', 
        //     endurl: 'ms-audit-finding-corrective-action-delay-analysis-by-departments', 
        //     riskItemId: 'department_ids', 
        //     riskTypeValue: 'title', 
        //     //riskTypeValue2 : 'count',
        //     tabletiltle: 'department', 
        //     activityname: 'EXPORT_PROCESS_COUNT_BY_INTERNAL_STAKEHOLDERS',
        //     listPermission: 'EXPORT_PROCESS' 
        // },
    ];
    @observable
    private _activityLogs: ActivityLogs[] = [];

    @observable
    private _cyberDetails:any=null
  
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

    reportId:number=2;

    @observable
    selectedReportObject: CyberReport = null;

    @observable
    private _cyberReportsList: CyberReport[] = [];

    @observable
    private _cyberRiskCountDetails: CyberRiskDetails[] = [];

    @observable
    private _cyberCountDetails:[] = [];

    @observable
    reportloaded: boolean = false;

    @observable
    cyberRiskListingTableTitle: string;

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
        this._cyberRiskCountDetails = [];
        this.listloaded = false;
    }

    @action
    setExternalRiskCountDetails(response: CyberRiskDetailsPaginationResponse) {
        this._cyberRiskCountDetails = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.listloaded = true;
    }

    @action
    setCyberReport(details:any) {
        
            //this.loaded = true;
            this._cyberDetails = details;
    }

    @action
    setReportId(id)
    {
        this.reportId=id;
    }

    @action
    clearCyberReport() {
        this.loaded = false;
        this._cyberDetails = null;
    }

    @action
    setCyberRiskListingTableTitle(cyberRiskListingTableTitle: string) {
        this.cyberRiskListingTableTitle = 'By '+ cyberRiskListingTableTitle+' ';
    }

    @computed
    get CyberRiskListingTableTitle(): string {
        
        return this.cyberRiskListingTableTitle;
    }
    
    @computed
    get CyberReportDetails(): CyberReport {
        return this._cyberDetails;
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
    setCyberCountDetails(response) {
        this._cyberCountDetails = response.data;
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
    get CyberReportListArray() {

        return this.reportLists;
    }

    @computed
    get allItems(): CyberReport[] {

        return this._cyberReportsList.slice();
    }
    @computed
    get CyberItemsDetails(){

        return this._cyberCountDetails.slice();
    }

    @action
    cyberReportlistmakeEmpty() {
        this._cyberReportsList = [];
        this.reportloaded = false;
    }

    @action
    setCyberRiskDetails(response: any) {
        this._cyberReportsList = response;
        this.reportloaded = true;
    }

    @action
    cyberRisktlistmakeEmpty() {
        this._cyberCountDetails = [];
        this.listloaded = false;
    }

    @computed
    get cyberRiskItemsDetails(): CyberRiskDetails[] {

        return this._cyberRiskCountDetails.slice();
    }


}
export const CyberReportStore =new Store();