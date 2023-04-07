
import { action, computed, observable } from "mobx-angular";
import { OrganizationReportCount, OrganizationReportDetails, OrganizationReportList, OrganizationReportsPaginationResponse } from "src/app/core/models/organization/organization-report/organization-report";

class Store {
    reportLists: OrganizationReportList[] = [

        
        { 
            id: '1', 
            checkLevel: 'is_department',
            title: 'issue_count_by_department', 
            type: 'issue-count-by-department', 
            reportType: 'organization', 
            reportUniqueKey: 'finding',
            endurl: 'issue-count-by-department', 
            itemId: 'department_ids', 
            typeValue: 'department_title',
            paramsId: 'department_id',
            tabletiltle: 'department', 
            activityname: '',
            listPermission: '',
            downloadFileTitle: 'organization_issues',
            downloadCountFileTitle: 'issue_by_department_count'
        },
        
        { 
            id: '2', 
            title: 'issue_count_by_ms_type', 
            type: 'issue-count-by-ms-type', 
            reportType: 'organization', 
            checkLevel: 'is_ms_type',
            reportUniqueKey: 'finding',
            endurl: 'issue-count-by-ms-type', 
            itemId: 'ms_type_ids', 
            typeValue: 'ms_type_title',
            paramsId: 'ms_type_id',
            tabletiltle: 'ms_type', 
            activityname: '',
            listPermission: '',
            downloadFileTitle: 'organization_issues',
            downloadCountFileTitle: 'issue_by_ms_type_count'
        },
        { 
            id: '3', 
            title: 'issue_count_by_type', 
            type: 'issue-count-by-type', 
            reportType: 'organization', 
            reportUniqueKey: 'finding',
            endurl: 'issue-count-by-type', 
            itemId: 'issue_type_ids', 
            typeValue: 'issue_type_title',
            paramsId: 'issue_type_id',
            tabletiltle: 'issue_count_by_type', 
            activityname: '',
            listPermission: '',
            downloadFileTitle: 'organization_issues',
            downloadCountFileTitle: 'issue_by_type_count'
        }, 
        { 
            id: '4', 
            title: 'issue_count_by_category', 
            type: 'issue-count-by-category', 
            reportType: 'organization', 
            reportUniqueKey: 'finding',
            endurl: 'issue-count-by-category', 
            itemId: 'issue_category_ids', 
            typeValue: 'issue_category_title',
            paramsId: 'issue_category_id',
            tabletiltle: 'issue_count_by_category', 
            activityname: '',
            listPermission: '',
            downloadFileTitle: 'organization_issues',
            downloadCountFileTitle: 'issue_by_category_count'
        },
        { 
            id: '5', 
            title: 'issue_count_by_internal_stakeholder', 
            type: 'issue-count-by-internal-stakeholder', 
            reportType: 'organization', 
            reportUniqueKey: 'finding_ca',
            endurl: 'issue-count-by-internal-stakeholder', 
            itemId: 'stakeholder_ids', 
            typeValue: 'stakeholder_title',
            paramsId: 'stakeholder_id',
            tabletiltle: 'issue_count_by_internal_stakeholder', 
            activityname: '',
            listPermission: '',
            downloadFileTitle: 'organization_issues',
            downloadCountFileTitle: 'issue_by_internal_stakeholder_count'
        }, 
        { 
            id: '6', 
            title: 'issue_count_by_external_stakeholder', 
            type: 'issue-count-by-external-stakeholder', 
            reportType: 'organization', 
            reportUniqueKey: 'finding_ca',
            endurl: 'issue-count-by-external-stakeholder', 
            itemId: 'stakeholder_ids', 
            typeValue: 'stakeholder_title',
            paramsId: 'stakeholder_id',
            tabletiltle: 'issue_count_by_external_stakeholder', 
            activityname: '',
            listPermission: '',
            downloadFileTitle: 'organization_issues',
            downloadCountFileTitle: 'issue_count_by_external_stakeholder'
        }
    ];

    @observable
    private _organizationReportsList: OrganizationReportCount[] = [];

    @observable
    private _organizationReportsCountDetails: OrganizationReportDetails[] = [];

    @observable
    reportloaded: boolean = false;

    @observable
    listloaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'reference_code';

    // @observable
    // individual_nonComformity_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    selected: number = null;

    // @observable
    // nonComformityId: string;

    @observable
    currentDate=new Date();

    @observable
    organizationReportDetailsListingTableTitle: string;

    @observable
    selectedReportObject: OrganizationReportList = null;

    @action
    setOrganizationReportDetails(response: any) {
        this._organizationReportsList = response;
        this.reportloaded = true;
    }

    @action
    setOrganizationReportsCountDetails(response: OrganizationReportsPaginationResponse) {
        this._organizationReportsCountDetails = response.data;
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
    setOrganizationReportDetailsListingTableTitle(nonComformityReportDetailsListingTableTitle: string) {
        this.organizationReportDetailsListingTableTitle = `Organization Issues by ${nonComformityReportDetailsListingTableTitle}`;
    }

    @action
    OrganizationReportlistmakeEmpty() {
        this._organizationReportsList = [];
        this.reportloaded = false;
    }

    @action
    OrganizationReportDetailslistmakeEmpty() {
        this._organizationReportsCountDetails = [];
        this.listloaded = false;
    }

    @computed
    get getOrganizationReportDetailsListingTableTitle(): string {
        return this.organizationReportDetailsListingTableTitle;
    }


    @computed
    get allItems(): OrganizationReportCount[] {
        return this._organizationReportsList.slice();
    }

    @computed
    get organizationReportsItemsDetails(): OrganizationReportDetails[] {
        return this._organizationReportsCountDetails.slice();
    }

    @computed
    get organizationReportListArray(): OrganizationReportList[] {

        return this.reportLists;
    }


}

export const OrganizationReportStore = new Store();




