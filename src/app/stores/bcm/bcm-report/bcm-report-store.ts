
import { action, computed, observable } from "mobx-angular";
import { BCMReport, BCMReportDetails, BCMReportDetailsPaginationResponse, BCMReportList } from "src/app/core/models/bcm/bcm-report/bcm-report";

class Store {
    reportLists: BCMReportList[] = [
        
        { 
            id: '1', 
            title: 'bcm_critical_process_reports', 
            type: 'bcm-critical-process-reports', 
            reportType: 'bcm', 
            endurl: 'bcm-critical-process-reports', 
            bcmItemId: '', 
            bcmTypeValue: 'title', 
            tabletiltle: 'critical_process', 
            activityname: '',
            listPermission: ''
        },
        { 
            id: '2', 
            title: 'bcm_risk_reports', 
            type: 'bcm-risk-reports', 
            reportType: 'bcm', 
            endurl: 'bcm-risk-reports', 
            bcmItemId: '', 
            bcmTypeValue: 'risk_ratings',
            tabletiltle: 'bcm_risk', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '3', 
            title: 'bcm_bia_performed_reports', 
            type: 'bcm-bia-performed-reports', 
            reportType: 'bcm', 
            endurl: 'bcm-bia-performed-reports', 
            bcmItemId: '', 
            bcmTypeValue: 'title',
            tabletiltle: 'bia_performed', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '4', 
            title: 'bcm_bia_by_years_reports', 
            type: 'bcm-bia-by-years-reports', 
            reportType: 'bcm', 
            endurl: 'bcm-bia-by-years-reports', 
            bcmItemId: '', 
            bcmTypeValue: 'year',
            tabletiltle: 'bia_by_years', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '8', 
            title: 'bcm_strategy_report_by_statuses', 
            type: 'bcm-strategy-report-by-statuses', 
            reportType: 'bcm', 
            endurl: 'bcm-strategy-report-by-statuses', 
            bcmItemId: '', 
            bcmTypeValue: 'business_continuity_strategy_status',
            tabletiltle: 'strategy_statuses', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '6', 
            title: 'bcm_strategy_report_by_types', 
            type: 'bcm-strategy-report-by-types', 
            reportType: 'bcm', 
            endurl: 'bcm-strategy-report-by-types', 
            bcmItemId: '', 
            bcmTypeValue: 'type',
            tabletiltle: 'strategy_types', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '7', 
            title: 'bcm_solution_report_by_scores', 
            type: 'bcm-solution-report-by-scores', 
            reportType: 'bcm', 
            endurl: 'bcm-solution-report-by-scores', 
            bcmItemId: '-rating_ids', 
            bcmTypeValue: 'score',
            tabletiltle: 'solution_scores', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '5', 
            title: 'bcm_bcp_report_by_statuses', 
            type: 'bcm-bcp-report-by-statuses', 
            reportType: 'bcm', 
            endurl: 'bcm-bcp-report-by-statuses', 
            bcmItemId: '', 
            bcmTypeValue: 'business_continuity_plan_status',
            tabletiltle: 'bcp_statuses', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '9', 
            title: 'bcm_change_request_report_by_years', 
            type: 'bcm-change-request-report-by-years', 
            reportType: 'bcm', 
            endurl: 'bcm-change-request-report-by-years', 
            bcmItemId: '', 
            bcmTypeValue: 'year',
            tabletiltle: 'year', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '10', 
            title: 'bcm_test_and_exercise_performed_reports', 
            type: 'bcm-test-and-exercise-performed-reports', 
            reportType: 'bcm', 
            endurl: 'bcm-test-and-exercise-performed-reports', 
            bcmItemId: '', 
            bcmTypeValue: 'title',
            tabletiltle: 'test_and_exercise_performed', 
            activityname: '',
            listPermission: '' 
        }, 
    ];

    @observable
    private _bcmReportsList: BCMReport[] = [];

    @observable
    private _bcmReportsCountDetails: BCMReportDetails[] = [];

    @observable
    reportloaded: boolean = false;

    @observable
    listloaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'reference_code';

    @observable
    individual_bcm_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    selected: number = null;

    @observable
    bcmId: string;

    @observable
    currentDate=new Date();

    @observable
    bcmReportDetailsListingTableTitle: string;

    @observable
    selectedReportObject: BCMReportList = null;

    @action
    setBCMReportDetails(response: any) {
        this._bcmReportsList = response;
        this.reportloaded = true;
    }

    @action
    setBCMReportsCountDetails(response: BCMReportDetailsPaginationResponse) {
        this._bcmReportsCountDetails = response.data;
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
    setBCMReportDetailsListingTableTitle(bcmReportDetailsListingTableTitle: string) {
        this.bcmReportDetailsListingTableTitle = `Bcm by ${bcmReportDetailsListingTableTitle}`;
    }

    @action
    BCMReportlistmakeEmpty() {
        this._bcmReportsList = [];
        this.reportloaded = false;
    }

    @action
    BCMReportDetailslistmakeEmpty() {
        this._bcmReportsCountDetails = [];
        this.listloaded = false;
    }

    @action
    setBcmId(id: string) {
        this.bcmId = id;
    }

    @computed
    get getBCMReportDetailsListingTableTitle(): string {
        
        return this.bcmReportDetailsListingTableTitle;
    }


    @computed
    get allItems(): BCMReport[] {

        return this._bcmReportsList.slice();
    }

    @computed
    get BCMReportsItemsDetails(): BCMReportDetails[] {

        return this._bcmReportsCountDetails.slice();
    }

    @computed
    get BCMReportListArray(): BCMReportList[] {
        return this.reportLists;
    }


}

export const BCMReportStore = new Store();