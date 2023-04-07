import { action, computed, observable } from "mobx-angular";
import { AmAuditReport, AmAuditReportDetails, AmAuditReportDetailsPaginationResponse, AmAuditReportList } from "src/app/core/models/audit-management/am-audit-reports/am-audit-report";


class Store {
    reportLists: AmAuditReportList[] = [
        
        { 
            id: '1', 
            title: 'am_annual_audit_plan_by_categories', 
            type: 'am-annual-audit-plan-by-categories', 
            reportType: 'am_annual_plans', 
            endurl: 'am-annual-audit-plan-by-categories', 
            amAuditItemId: 'am_audit_category_ids', 
            amAuditTypeValue: 'title', 
            tabletiltle: 'am_annual_audit_plan_categories', 
            activityname: '',
            listPermission: ''
        },
        { 
            id: '2', 
            title: 'am_annual_audit_plan_by_frequencies', 
            type: 'am-annual-audit-plan-by-frequencies', 
            reportType: 'am_annual_plans', 
            endurl: 'am-annual-audit-plan-by-frequencies', 
            amAuditItemId: 'am_annual_plan_frequency_ids', 
            amAuditTypeValue: 'title',
            tabletiltle: 'am_annual_audit_plan_frequencies', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '3', 
            title: 'am_audit_by_year', 
            type: 'am-audit-by-year', 
            reportType: 'am_audits', 
            endurl: 'am-audit-by-year', 
            amAuditItemId: 'audit_year', 
            amAuditTypeValue: 'year',
            tabletiltle: 'am_audit_year', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '4', 
            title: 'am_audit_by_departments', 
            type: 'am-audit-by-departments', 
            reportType: 'am_audits', 
            endurl: 'am-audit-by-departments', 
            amAuditItemId: 'department_ids', 
            amAuditTypeValue: 'title',
            tabletiltle: 'am_audit_departments', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '5', 
            title: 'am_audit_by_managers', 
            type: 'am-audit-by-managers', 
            reportType: 'am_audits', 
            endurl: 'am-audit-by-managers', 
            amAuditItemId: 'audit_manager_ids', 
            amAuditTypeValue: 'first_name',
            amAuditTypeValue2: 'last_name',
            tabletiltle: 'am_audit_managers', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '6', 
            title: 'am_audit_by_statuses', 
            type: 'am-audit-by-statuses', 
            reportType: 'am_audits', 
            endurl: 'am-audit-by-statuses', 
            amAuditItemId: 'am_audit_status_ids', 
            amAuditTypeValue: 'title',
            tabletiltle: 'am_audit_statuses', 
            activityname: '',
            listPermission: '' 
        },
        // { 
        //     id: '7', 
        //     title: 'finding_by_categories', 
        //     type: 'finding-by-categories', 
        //     reportType: 'am_audit_findings', 
        //     endurl: 'finding-by-categories', 
        //     amAuditItemId: 'finding_category_ids', 
        //     amAuditTypeValue: 'title',
        //     tabletiltle: 'finding_categories', 
        //     activityname: '',
        //     listPermission: '' 
        // },
        { 
            id: '8', 
            title: 'finding_by_statuses', 
            type: 'finding-by-statuses', 
            reportType: 'am_audit_findings', 
            endurl: 'finding-by-statuses', 
            amAuditItemId: 'finding_status_ids', 
            amAuditTypeValue: 'title',
            tabletiltle: 'finding_statuses', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '9', 
            title: 'finding_by_risk_ratings', 
            type: 'finding-by-risk-ratings', 
            reportType: 'am_audit_findings', 
            endurl: 'finding-by-risk-ratings', 
            amAuditItemId: 'risk_rating_ids', 
            amAuditTypeValue: 'title',
            tabletiltle: 'finding_risk_rating', 
            activityname: '',
            listPermission: '' 
        },
       
        
           
    ];

    @observable
    private _amAuditReportsList: AmAuditReport[] = [];

    @observable
    private _amAuditReportsCountDetails: AmAuditReportDetails[] = [];

    @observable
    reportloaded: boolean = false;

    @observable
    listloaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'reference_code';

    @observable
    individual_am_audit_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    selected: number = null;

    @observable
    amAuditId: string;

    @observable
    currentDate=new Date();

    @observable
    amAuditReportDetailsListingTableTitle: string;

    @observable
    selectedReportObject: AmAuditReportList = null;

    @action
    setAmAuditReportDetails(response: any) {
        this._amAuditReportsList = response;
        this.reportloaded = true;
    }

    @action
    setAmAuditReportsCountDetails(response: AmAuditReportDetailsPaginationResponse) {
        this._amAuditReportsCountDetails = response.data;
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
    setAmAuditReportDetailsListingTableTitle(amAuditReportDetailsListingTableTitle: string) {
        this.amAuditReportDetailsListingTableTitle = `Audit by ${amAuditReportDetailsListingTableTitle}`;
    }

    @action
    AmAuditReportlistmakeEmpty() {
        this._amAuditReportsList = [];
        this.reportloaded = false;
    }

    @action
    AmAuditReportDetailslistmakeEmpty() {
        this._amAuditReportsCountDetails = [];
        this.listloaded = false;
    }

    @action
    setAmAuditId(id: string) {
        this.amAuditId = id;
    }

    @computed
    get getAmAuditReportDetailsListingTableTitle(): string {
        
        return this.amAuditReportDetailsListingTableTitle;
    }


    @computed
    get allItems(): AmAuditReport[] {

        return this._amAuditReportsList.slice();
    }

    @computed
    get AmAuditReportsItemsDetails(): AmAuditReportDetails[] {

        return this._amAuditReportsCountDetails.slice();
    }

    @computed
    get AmAuditReportListArray(): AmAuditReportList[] {

        return this.reportLists;
    }


}

export const AmAuditReportStore = new Store();