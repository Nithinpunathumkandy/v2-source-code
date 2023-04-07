
import { action, computed, observable } from "mobx-angular";
import { KpiReport, KpiReportDetails, KpiReportDetailsPaginationResponse, KpiReportList } from "src/app/core/models/kpi-management/report/kpi-report";

class Store {
    reportLists: KpiReportList[] = [
        { 
            id: '1', 
            title: 'kpi_count_by_type', 
            type: 'kpi-count-by-type', 
            reportType: 'kpi', 
            endurl: 'kpi-count-by-type', 
            kpiItemId: 'kpi_type_ids', 
            kpiTypeValue: 'title', 
            tabletiltle: 'types', 
            activityname: 'EXPORT_RISK_COUNT_BY_DEPARTMENTS' 
        },
        { 
            id: '2', 
            title: 'kpi_count_by_category', 
            type: 'kpi-count-by-category', 
            reportType: 'kpi', 
            endurl: 'kpi-count-by-category', 
            kpiItemId: 'kpi_category_ids', 
            kpiTypeValue: 'title', 
            tabletiltle: 'category', 
            activityname: 'EXPORT_RISK_COUNT_BY_DIVISIONS' 
        },
        { 
            id: '3', 
            title: 'kpi_count_by_status', 
            type: 'kpi-count-by-status', 
            reportType: 'kpi', 
            endurl: 'kpi-count-by-status', 
            kpiItemId: 'kpi_management_status_ids', 
            kpiTypeValue: 'title', 
            tabletiltle: 'status', 
            activityname: 'EXPORT_RISK_COUNT_BY_SECTIONS' 
        },
        { 
            id: '4', 
            title: 'kpi_count_by_frequency', 
            type: 'kpi-count-by-frequency', 
            reportType: 'kpi', 
            endurl: 'kpi-count-by-frequency', 
            kpiItemId: 'review_frequency_ids', 
            kpiTypeValue: 'title', 
            tabletiltle: 'frequency', 
            activityname: 'EXPORT_RISK_COUNT_BY_SUB_SECTIONS' 
        },
        { 
            id: '5', 
            checkLevel: 'is_department',
            title: 'kpi_count_by_department', 
            type: 'kpi-count-by-department', 
            reportType: 'kpi', 
            endurl: 'kpi-count-by-department', 
            kpiItemId: 'department_ids', 
            kpiTypeValue: 'title', 
            tabletiltle: 'department', 
            activityname: 'EXPORT_RISK_COUNT_BY_MS_TYPES' 
        },
        { 
            id: '6', 
            title: 'kpi_score_count_by_status', 
            type: 'kpi-score-count-by-status', 
            reportType: 'kpiScore', 
            endurl: 'kpi-score-count-by-status', 
            kpiItemId: 'kpi_management_kpi_score_status_ids', 
            kpiTypeValue: 'title', 
            tabletiltle: 'status', 
            activityname: 'EXPORT_RISK_COUNT_BY_RISK_TYPES' 
        },
    ];

    @observable
    private _kpiReportsList: KpiReport[] = [];

    @observable
    private _kpiReportsCountDetails: KpiReportDetails[] = [];

    @observable
    reportloaded: boolean = false;

    @observable
    listloaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'reference_code';

    @observable
    individual_kpi_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    selected: number = null;

    @observable
    kpiId: string;

    @observable
    currentDate=new Date();

    @observable
    kpiReportDetailsListingTableTitle: string;

    @observable
    selectedReportObject: KpiReportList = null;

    @action
    setKpiReportDetails(response: any) {
        this._kpiReportsList = response;
        this.reportloaded = true;
    }

    @action
    setKpiReportsCountDetails(response: KpiReportDetailsPaginationResponse) {
        this._kpiReportsCountDetails = response.data;
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
    setKpiReportDetailsListingTableTitle(kpiReportDetailsListingTableTitle: string) {
        this.kpiReportDetailsListingTableTitle = `KPI by ${kpiReportDetailsListingTableTitle}`;
    }

    @action
    kpiReportlistmakeEmpty() {
        this._kpiReportsList = [];
        this.reportloaded = false;
    }

    @action
    kpiReportDetailslistmakeEmpty() {
        this._kpiReportsCountDetails = [];
        this.listloaded = false;
    }

    @action
    setKpiId(id: string) {
        this.kpiId = id;
    }

    @computed
    get getKpiReportDetailsListingTableTitle(): string {
        
        return this.kpiReportDetailsListingTableTitle;
    }


    @computed
    get allItems(): KpiReport[] {
        return this._kpiReportsList.slice();
    }

    @computed
    get kpiReportsItemsDetails(): KpiReportDetails[] {
        return this._kpiReportsCountDetails.slice();
    }

    @computed
    get kpiReportListArray(): KpiReportList[] {

        return this.reportLists;
    }


}

export const KpiReportStore = new Store();