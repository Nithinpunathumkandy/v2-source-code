import { observable, action, computed } from "mobx-angular";
import { JsoReport, JsoReportDetails, JsoReportDetailsPaginationResponse,JsoReportPaginationResponse, JsoReportList} from 'src/app/core/models/jso/jso-report/jso-report';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
class Store {
    reportLists: JsoReportList[] = [
        { 
            id: '1', 
            title: 'jso_by_years', 
            type: 'jso-by-years', 
            reportType: 'jso', 
            endurl: 'jso-count-by-years', 
            riskItemId: 'year', 
            riskTypeValue: 'year', 
            tabletiltle: 'year', 
            activityname: 'EXPORT_REPORT_JSO_OBSERVATION_COUNT_BY_YEAR',
            listPermission: 'EXPORT_JSO_OBSERVATION'
        },
        { 
            id: '2', 
            title: 'jso_by_users', 
            type: 'jso-by-users', 
            reportType: 'jso', 
            endurl: 'jso-count-by-users', 
            riskItemId: 'created_by_ids', 
            riskTypeValue: 'name',
            tabletiltle: 'user', 
            activityname: 'EXPORT_REPORT_JSO_OBSERVATION_COUNT_BY_USER',
            listPermission: 'EXPORT_JSO_OBSERVATION' 
        },
        { 
            id: '3', 
            checkLevel: 'is_department',
            title: 'jso_by_departments', 
            type: 'jso-by-departments', 
            reportType: 'jso', 
            endurl: 'jso-count-by-departments', 
            riskItemId: 'department_ids', 
            riskTypeValue: 'department_title',  
            tabletiltle: 'department', 
            activityname: 'EXPORT_REPORT_JSO_OBSERVATION_COUNT_BY_DEPARTMENT',
            listPermission: 'EXPORT_JSO_OBSERVATION' 
        },
        { 
            id: '4', 
            title: 'jso_by_categories', 
            type: 'jso-by-categories', 
            reportType: 'jsoUnsafe', 
            endurl: 'jso-count-by-categories', 
            riskItemId: 'unsafe_action_category_ids', 
            riskTypeValue: 'title', 
            tabletiltle: 'category', 
            activityname: 'EXPORT_REPORT_JSO_OBSERVATION_COUNT_BY_CATEGORY',
            listPermission: 'EXPORT_JSO_OBSERVATION_UNSAFE_ACTION' 
        },
        { 
            id: '5', 
            title: 'jso_by_action_types', 
            type: 'jso-by-action-types', 
            reportType: 'jso', 
            endurl: 'jso-count-by-action-types', 
            riskItemId: 'finding_status_ids', 
            riskTypeValue: 'type', 
            tabletiltle: 'action_type', 
            activityname: 'EXPORT_REPORT_JSO_OBSERVATION_COUNT_BY_ACTION_TYPE',
            listPermission: 'EXPORT_JSO_OBSERVATION'
        },
        { 
            id: '6', 
            title: 'jso_by_statuses', 
            type: 'jso-count-by-statuses', 
            reportType: 'jso', 
            endurl: 'jso-count-by-statuses', 
            riskItemId: 'unsafe_action_status_ids', 
            riskTypeValue: 'status', 
            tabletiltle: 'status', 
            activityname: 'EXPORT_REPORT_JSO_OBSERVATION_COUNT_BY_STATUS',
            listPermission: 'EXPORT_JSO_OBSERVATION'
        },
        
    ];
    @observable
    private _jsoReportsList: JsoReport[] = [];

    @observable
    private _jsoReportsCountDetails: JsoReportDetails[] = [];

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
    jsoReportDetailsListingTableTitle: string;

    @observable
    selectedReportObject: JsoReportList = null;

    @action
    setJsoReportDetails(response: any) {
        this._jsoReportsList = response;
        this.reportloaded = true;
    }

    @action
    setJsoReportsCountDetails(response: JsoReportDetailsPaginationResponse) {
        this._jsoReportsCountDetails = response.data;
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
    setJsoReportDetailsListingTableTitle(jsoReportDetailsListingTableTitle: string) {
        this.jsoReportDetailsListingTableTitle = this.selectedReportObject.reportType == 'jso' ? `JSO by ${jsoReportDetailsListingTableTitle}` : `JSO Unsafe Actions by ${jsoReportDetailsListingTableTitle}`;
    }

    @action
    JsoReportlistmakeEmpty() {
        this._jsoReportsList = [];
        this.reportloaded = false;
    }

    @action
    JsoReportDetailslistmakeEmpty() {
        this._jsoReportsCountDetails = [];
        this.listloaded = false;
    }

    @action
    setRiskId(id: string) {
        this.riskId = id;
    }

    @computed
    get getJsoReportDetailsListingTableTitle(): string {
        
        return this.jsoReportDetailsListingTableTitle;
    }


    @computed
    get allItems(): JsoReport[] {

        return this._jsoReportsList.slice();
    }

    @computed
    get JsoReportsItemsDetails(): JsoReportDetails[] {

        return this._jsoReportsCountDetails.slice();
    }

    @computed
    get JsoReportListArray(): JsoReportList[] {

        return this.reportLists;
    }


}

export const JsoReportStore = new Store();




