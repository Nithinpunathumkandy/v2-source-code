import { observable, action, computed } from "mobx-angular";
import { IncidentManagementReport, IncidentManagementReportDetails, IncidentManagementReportDetailsPaginationResponse,IncidentManagementReportPaginationResponse, IncidentManagementReportList} from 'src/app/core/models/incident-management/incident-report/incident-report';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
class Store {
    reportLists: IncidentManagementReportList[] = [
        { 
            id: '1', 
            title: 'incident_by_damage_types', 
            type: 'incident-by-damage-types', 
            reportType: 'incident', 
            endurl: 'incident-by-damage-types', 
            riskItemId: 'incident_damage_type_ids', 
            riskTypeValue: 'title', 
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },
        { 
            id: '2', 
            title: 'incident_by_damage_saverities', 
            type: 'incident-by-damage-saverities', 
            reportType: 'incident', 
            endurl: 'incident-by-damage-saverities', 
            riskItemId: 'incident_damage_severity_ids', 
            riskTypeValue: 'title',
            tabletiltle: 'saverity', 
            activityname: 'REPORT_INCIDENTS_BY_DAMAGE_SAVERITIES_EXPORT',
            listPermission: 'EXPORT_INCIDENT' 
        },
        { 
            id: '3', 
            title: 'incident_by_categories', 
            type: 'incident-by-categories', 
            reportType: 'incident', 
            endurl: 'incident-by-categories', 
            riskItemId: 'incident_category_ids', 
            riskTypeValue: 'title',  
            tabletiltle: 'category', 
            activityname: 'REPORT_INCIDENTS_BY_CATEGORIES_EXPORT',
            listPermission: 'EXPORT_INCIDENT' 
        },
        { 
            id: '4', 
            title: 'incident_by_sub_categories', 
            type: 'incident-by-sub-categories', 
            reportType: 'incident', 
            endurl: 'incident-by-sub-categories', 
            riskItemId: 'incident_sub_category_ids', 
            riskTypeValue: 'title', 
            tabletiltle: 'sub_category', 
            activityname: 'REPORT_INCIDENTS_BY_SUB_CATEGORIES_EXPORT',
            listPermission: 'EXPORT_INCIDENT' 
        },
        { 
            id: '5', 
            title: 'incident_by_statuses', 
            type: 'incident-by-statuses', 
            reportType: 'incident', 
            endurl: 'incident-by-statuses', 
            riskItemId: 'incident_status_ids', 
            riskTypeValue: 'title', 
            tabletiltle: 'status', 
            activityname: 'REPORT_INCIDENTS_BY_STATUSES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },
        { 
            id: '6', 
            title: 'investigation_by_investigation_statuses', 
            type: 'investigation-by-investigation-statuses', 
            reportType: 'investigation', 
            endurl: 'investigation-by-investigation-statuses', 
            riskItemId: 'incident_investigation_status_ids', 
            riskTypeValue: 'title', 
            tabletiltle: 'status', 
            activityname: 'REPORT_INVESTIGATION_BY_INVESTIGATION_STATUSES_EXPORT',
            listPermission: 'EXPORT_INVESTIGATION_INCIDENT'
        },
        { 
            id: '7', 
            title: 'corrective_action_by_statuses', 
            type: 'corrective-action-by-corrective-action-statuses', 
            reportType: 'corrective', 
            endurl: 'corrective-action-by-corrective-action-statuses', 
            riskItemId: 'incident_corrective_action_status_ids', 
            riskTypeValue: 'title', 
            tabletiltle: 'status', 
            activityname: 'REPORT_CORRECTIVE_ACTION_BY_CORRECTIVE_ACTION_STATUSES_EXPORT',
            listPermission: 'EXPORT_INCIDENT_CORRECTIVE_ACTION'
        },
        
    ];
    @observable
    private _incidentManagementReportsList: IncidentManagementReport[] = [];

    @observable
    private _incidentManagementReportsCountDetails: IncidentManagementReportDetails[] = [];

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
    incidentManagementReportDetailsListingTableTitle: string;

    @observable
    selectedReportObject: IncidentManagementReportList = null;

    @action
    setIncidentManagementReportDetails(response: any) {
        this._incidentManagementReportsList = response;
        this.reportloaded = true;
    }

    @action
    setIncidentManagementReportsCountDetails(response: IncidentManagementReportDetailsPaginationResponse) {
        this._incidentManagementReportsCountDetails = response.data;
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
    setIncidentManagementReportDetailsListingTableTitle(incidentManagementReportDetailsListingTableTitle: string) {
        this.incidentManagementReportDetailsListingTableTitle = this.selectedReportObject.reportType == 'incident' ? `Incident by ${incidentManagementReportDetailsListingTableTitle}`
        : this.selectedReportObject.reportType == 'investigation' ? `Investigation by ${incidentManagementReportDetailsListingTableTitle}` : `Corrective Action by ${incidentManagementReportDetailsListingTableTitle}`;
    }

    @action
    IncidentManagementReportlistmakeEmpty() {
        this._incidentManagementReportsList = [];
        this.reportloaded = false;
    }

    @action
    IncidentManagementReportDetailslistmakeEmpty() {
        this._incidentManagementReportsCountDetails = [];
        this.listloaded = false;
    }

    @action
    setRiskId(id: string) {
        this.riskId = id;
    }

    @computed
    get getIncidentManagementReportDetailsListingTableTitle(): string {
        
        return this.incidentManagementReportDetailsListingTableTitle;
    }


    @computed
    get allItems(): IncidentManagementReport[] {

        return this._incidentManagementReportsList.slice();
    }

    @computed
    get IncidentManagementReportsItemsDetails(): IncidentManagementReportDetails[] {

        return this._incidentManagementReportsCountDetails.slice();
    }

    @computed
    get IncidentManagementReportListArray(): IncidentManagementReportList[] {

        return this.reportLists;
    }


}

export const IncidentManagementReportStore = new Store();




