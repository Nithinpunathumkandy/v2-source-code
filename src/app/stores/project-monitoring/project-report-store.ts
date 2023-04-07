import { observable, action, computed } from "mobx-angular";
import { ProjectReport, ProjectReportDetails, ProjectReportDetailsPaginationResponse, ProjectReportList} from 'src/app/core/models/project-monitoring/project-report';
class Store {
    reportLists: ProjectReportList[] = [
        {
            id: '1', 
            checkLevel: 'is_department',
            title: 'project_by_departments', 
            type: 'project-by-departments', 
            reportType: 'project', 
            endurl: 'project-by-departments', 
            riskItemId: 'department_ids', 
            riskTypeValue: 'title', 
            tabletiltle: 'department', 
            activityname: 'REPORT_PROJECT_BY_DEPARTMENT_EXPORT',
            listPermission: 'EXPORT_PROJECT_CHARTER'
        },
        { 
            id: '2', 
            title: 'project_by_statuses', 
            type: 'project-by-statuses', 
            reportType: 'project', 
            endurl: 'project-by-statuses', 
            riskItemId: 'project_monitoring_status_ids', 
            riskTypeValue: 'title', 
            tabletiltle: 'status', 
            activityname: 'REPORT_PROJECT_BY_STATUS_EXPORT',
            listPermission: 'EXPORT_PROJECT_CHARTER' 
        },
        { 
            id: '3', 
            title: 'project_by_types', 
            type: 'project-by-types', 
            reportType: 'project', 
            endurl: 'project-by-types', 
            riskItemId: 'project_type_ids', 
            riskTypeValue: 'title',
            tabletiltle: 'project_type', 
            activityname: 'REPORT_PROJECT_BY_TYPE_EXPORT',
            listPermission: 'EXPORT_PROJECT_CHARTER' 
        },
        { 
            id: '4', 
            title: 'project_by_priorities', 
            type: 'project-by-priorities', 
            reportType: 'project', 
            endurl: 'project-by-priorities', 
            riskItemId: 'project_priority_ids', 
            riskTypeValue: 'title',
            tabletiltle: 'project_priority', 
            activityname: 'REPORT_PROJECT_BY_PRIORITY_EXPORT',
            listPermission: 'EXPORT_PROJECT_CHARTER' 
        },
        { 
            id: '5', 
            title: 'project_by_owner', 
            type: 'project-by-owner', 
            reportType: 'project', 
            endurl: 'project-by-owners', 
            riskItemId: 'project_manager_ids', 
            riskTypeValue: 'first_name',
            riskTypeValue2: 'last_name', 
            tabletiltle: 'project_owner', 
            activityname: 'REPORT_PROJECT_BY_OWNER_EXPORT',
            listPermission: 'EXPORT_PROJECT_CHARTER' 
        },
        {
            id: '6', 
            checkLevel: 'is_department',
            title: 'change_request_by_departments', 
            type: 'change-request-by-departments', 
            reportType: 'change_request', 
            endurl: 'project-change-request-by-departments', 
            riskItemId: 'department_ids', 
            riskTypeValue: 'title', 
            tabletiltle: 'department', 
            activityname: 'REPORT_PROJECT_CHANGE_REQUEST_BY_DEPARTMENT_EXPORT',
            listPermission: 'EXPORT_PROJECT_CHANGE_REQUEST'
        },
        {
            id: '7', 
            title: 'change_request_by_statuses', 
            type: 'change-request-by-statuses', 
            reportType: 'change_request', 
            endurl: 'project-change-request-by-statuses', 
            riskItemId: 'project_change_request_status_ids', 
            riskTypeValue: 'title', 
            tabletiltle: 'status', 
            activityname: 'REPORT_PROJECT_CHANGE_REQUEST_BY_STATUS_EXPORT',
            listPermission: 'EXPORT_PROJECT_CHANGE_REQUEST'
        },
        {
            id: '8', 
            checkLevel: 'is_department',
            title: 'closure_by_departments', 
            type: 'closure-by-departments', 
            reportType: 'project_closure', 
            endurl: 'project-closure-by-departments', 
            riskItemId: 'department_ids', 
            riskTypeValue: 'title', 
            tabletiltle: 'department', 
            activityname: 'REPORT_PROJECT_CLOSURE_BY_DEPARTMENT_EXPORT',
            listPermission: 'EXPORT_PROJECT_MONITOR_CLOSURE'
        },
        {
            id: '9', 
            title: 'closure_by_statuses', 
            type: 'closure-by-statuses', 
            reportType: 'project_closure', 
            endurl: 'project-closure-by-statuses', 
            riskItemId: 'project_monitor_closure_status_ids', 
            riskTypeValue: 'title', 
            tabletiltle: 'status', 
            activityname: 'REPORT_PROJECT_CLOSURE_BY_STATUS_EXPORT',
            listPermission: 'EXPORT_PROJECT_MONITOR_CLOSURE'
        },
        
        
    ];
    @observable
    private _projectReportsList: ProjectReport[] = [];

    @observable
    private _projectReportsCountDetails: ProjectReportDetails[] = [];

    @observable
    reportloaded: boolean = false;

    @observable
    listloaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'reference_code';

    @observable
    individual_risk_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    selected: number = null;

    @observable
    riskId: string;

    @observable
    currentDate=new Date();

    @observable
    projectReportDetailsListingTableTitle: string;

    @observable
    selectedReportObject: ProjectReportList = null;

    @action
    setProjectReportDetails(response: any) {
        this._projectReportsList = response;
        this.reportloaded = true;
    }

    @action
    setProjectReportsCountDetails(response: ProjectReportDetailsPaginationResponse) {
        this._projectReportsCountDetails = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.listloaded = true;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setProjectReportDetailsListingTableTitle(projectReportDetailsListingTableTitle: string) {
        if(this.selectedReportObject.reportType == 'project'){
            this.projectReportDetailsListingTableTitle =  `Project by ${projectReportDetailsListingTableTitle}`

        }else if(this.selectedReportObject.reportType == 'change_request'){
            this.projectReportDetailsListingTableTitle =  `Change Request by ${projectReportDetailsListingTableTitle}`

        }else if(this.selectedReportObject.reportType == 'project_closure'){
            this.projectReportDetailsListingTableTitle =  `Project Closure by ${projectReportDetailsListingTableTitle}`
    }
}

    @action
    ProjectReportlistmakeEmpty() {
        this._projectReportsList = [];
        this.reportloaded = false;
    }

    @action
    ProjectReportDetailslistmakeEmpty() {
        this._projectReportsCountDetails = [];
        this.listloaded = false;
    }

    @action
    setRiskId(id: string) {
        this.riskId = id;
    }

    @computed
    get getProjectReportDetailsListingTableTitle(): string {
        
        return this.projectReportDetailsListingTableTitle;
    }


    @computed
    get allItems(): ProjectReport[] {

        return this._projectReportsList.slice();
    }

    @computed
    get ProjectReportsItemsDetails(): ProjectReportDetails[] {

        return this._projectReportsCountDetails.slice();
    }

    @computed
    get ProjectReportListArray(): ProjectReportList[] {

        return this.reportLists;
    }


}

export const ProjectReportStore = new Store();




