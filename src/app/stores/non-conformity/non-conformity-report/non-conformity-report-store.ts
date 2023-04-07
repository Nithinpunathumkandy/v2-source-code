
import { action, computed, observable } from "mobx-angular";
import { NonComformityReport, NonComformityReportDetails, NonComformityReportDetailsPaginationResponse, NonComformityReportList } from "src/app/core/models/non-conformity/non-conformity-report/non-conformity-report";

class Store {
    reportLists: NonComformityReportList[] = [

        { 
            id: '1', 
            checkLevel: 'is_subsidiary',
            title: 'finding_by_organizations', 
            type: 'finding-by-organizations', 
            reportType: 'nonComformity', 
            reportUniqueKey: 'finding',
            endurl: 'noc-finding-by-organizations', 
            nonComformityItemId: 'organization_ids', 
            nonComformityTypeValue: 'organization',
            tabletiltle: 'organization', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '2', 
            checkLevel: 'is_division',
            title: 'finding_by_divisions', 
            type: 'finding-by-divisions', 
            reportType: 'nonComformity', 
            reportUniqueKey: 'finding',
            endurl: 'noc-finding-by-divisions', 
            nonComformityItemId: 'division_ids', 
            nonComformityTypeValue: 'division',
            tabletiltle: 'division', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '3', 
            checkLevel: 'is_department',
            title: 'finding_by_departments', 
            type: 'finding-by-departments', 
            reportType: 'nonComformity', 
            reportUniqueKey: 'finding',
            endurl: 'noc-finding-by-departments', 
            nonComformityItemId: 'department_ids', 
            nonComformityTypeValue: 'department',
            tabletiltle: 'department', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '4', 
            checkLevel: 'is_section',
            title: 'finding_by_sections', 
            type: 'finding-by-sections', 
            reportType: 'nonComformity', 
            reportUniqueKey: 'finding',
            endurl: 'noc-finding-by-sections', 
            nonComformityItemId: 'section_ids', 
            nonComformityTypeValue: 'section',
            tabletiltle: 'section', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '5', 
            checkLevel: 'is_sub_section',
            title: 'finding_by_sub_sections', 
            type: 'finding-by-sub-sections', 
            reportType: 'nonComformity', 
            reportUniqueKey: 'finding',
            endurl: 'noc-finding-by-sub-sections', 
            nonComformityItemId: 'sub_section_ids', 
            nonComformityTypeValue: 'sub_section',
            tabletiltle: 'sub_section', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '6', 
            title: 'finding_by_categories', 
            type: 'finding-by-categories', 
            reportType: 'nonComformity', 
            reportUniqueKey: 'finding',
            endurl: 'noc-finding-by-categories', 
            nonComformityItemId: 'finding_category_ids', 
            nonComformityTypeValue: 'title',
            tabletiltle: 'finding_by_categories', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '7', 
            title: 'finding_by_risk_ratings', 
            type: 'finding-by-risk-ratings', 
            reportType: 'nonComformity', 
            reportUniqueKey: 'finding',
            endurl: 'noc-finding-by-risk-ratings', 
            nonComformityItemId: 'risk_rating_ids', 
            nonComformityTypeValue: 'title',
            tabletiltle: 'finding_risk_ratings', 
            activityname: '',
            listPermission: '' 
        }, 
        { 
            id: '8', 
            title: 'finding_by_statuses', 
            type: 'finding-by-statuses', 
            reportType: 'nonComformity', 
            reportUniqueKey: 'finding',
            endurl: 'noc-finding-by-statuses', 
            nonComformityItemId: 'finding_status_ids', 
            nonComformityTypeValue: 'title',
            tabletiltle: 'finding_by_statuses', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '9', 
            title: 'finding_corrective_action_by_responsible_users', 
            type: 'finding-corrective-action-by-responsible-users', 
            reportType: 'nonComformity', 
            reportUniqueKey: 'finding_ca',
            endurl: 'noc-finding-corrective-action-by-responsible-users', 
            nonComformityItemId: 'responsible_user_ids', 
            nonComformityTypeValue: 'responsible_user_first_name',
            nonComformityTypeValue2: 'responsible_user_last_name',
            tabletiltle: 'responsible_users', 
            activityname: '',
            listPermission: '' 
        }, 
        { 
            id: '10', 
            title: 'finding_corrective_action_by_statuses', 
            type: 'finding-corrective-action-by-statuses', 
            reportType: 'nonComformity', 
            reportUniqueKey: 'finding_ca',
            endurl: 'noc-finding-corrective-action-by-statuses', 
            nonComformityItemId: 'finding_corrective_action_status_ids', 
            nonComformityTypeValue: 'title',
            tabletiltle: 'finding_corrective_action_statuses', 
            activityname: '',
            listPermission: '' 
        }, 
       
    ];

    @observable
    private _nonComformityReportsList: NonComformityReport[] = [];

    @observable
    private _nonComformityReportsCountDetails: NonComformityReportDetails[] = [];

    @observable
    reportloaded: boolean = false;

    @observable
    listloaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'reference_code';

    @observable
    individual_nonComformity_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    selected: number = null;

    @observable
    nonComformityId: string;

    @observable
    currentDate=new Date();

    @observable
    nonComformityReportDetailsListingTableTitle: string;

    @observable
    selectedReportObject: NonComformityReportList = null;

    @action
    setNonComformityReportDetails(response: any) {
        this._nonComformityReportsList = response;
        this.reportloaded = true;
    }

    @action
    setNonComformityReportsCountDetails(response: NonComformityReportDetailsPaginationResponse) {
        this._nonComformityReportsCountDetails = response.data;
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
    setNonComformityReportDetailsListingTableTitle(nonComformityReportDetailsListingTableTitle: string) {
        this.nonComformityReportDetailsListingTableTitle = `Non Conformity by ${nonComformityReportDetailsListingTableTitle}`;
    }

    @action
    NonComformityReportlistmakeEmpty() {
        this._nonComformityReportsList = [];
        this.reportloaded = false;
    }

    @action
    NonComformityReportDetailslistmakeEmpty() {
        this._nonComformityReportsCountDetails = [];
        this.listloaded = false;
    }

    @action
    setNonComformityId(id: string) {
        this.nonComformityId = id;
    }

    @computed
    get getNonComformityReportDetailsListingTableTitle(): string {
        
        return this.nonComformityReportDetailsListingTableTitle;
    }


    @computed
    get allItems(): NonComformityReport[] {
        return this._nonComformityReportsList.slice();
    }

    @computed
    get NonComformityReportsItemsDetails(): NonComformityReportDetails[] {
        return this._nonComformityReportsCountDetails.slice();
    }

    @computed
    get NonComformityReportListArray(): NonComformityReportList[] {

        return this.reportLists;
    }


}

export const NonComformityReportStore = new Store();




