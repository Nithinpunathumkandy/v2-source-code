import { observable, action, computed } from "mobx-angular";
import { KHReport, KHRiskDetails, KHRiskDetailsPaginationResponse,KHReportPaginationResponse, KHReportList} from 'src/app/core/models/knowledge-hub/kh-report/kh-report';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
class Store {
    reportLists: KHReportList[] = [
        { 
            id: '1', 
            title: 'documents_types', 
            type: 'document-by-types', 
            reportType: 'documentkh', 
            endurl: 'document-count-by-types', 
            riskItemId: 'document_type_ids', 
            riskTypeValue: 'document_type', 
            tabletiltle: 'types', 
            activityname: 'EXPORT_DOCUMENT_COUNT_BY_DOCUMENT_TYPES' 
        },
        { 
            id: '2', 
            title: 'document_statuses', 
            type: 'document-by-statuses', 
            reportType: 'documentkh', 
            endurl: 'document-count-by-statuses', 
            riskItemId: 'document_status_ids', 
            riskTypeValue: 'document_status',
            tabletiltle: 'status', 
            activityname: 'EXPORT_DOCUMENT_COUNT_BY_STATUSES' 
        },
        { 
            id: '3', 
            title: 'document_access_types', 
            type: 'document-by-access-types', 
            reportType: 'documentkh', 
            endurl: 'document-count-by-access-types', 
            riskItemId: 'document_access_type_ids', 
            riskTypeValue: 'document_access_type', 
            tabletiltle: 'access_type', 
            activityname: 'EXPORT_DOCUMENT_COUNT_BY_ACCESS_TYPES' 
        },
        { 
            id: '4',
            checkLevel: 'is_subsidiary',
            title: 'document_organizations', 
            type: 'document-by-organizations', 
            reportType: 'documentkh', 
            endurl: 'document-count-by-organizations', 
            riskItemId: 'organization_ids', 
            riskTypeValue: 'organization', 
            tabletiltle: 'organization', 
            activityname: 'EXPORT_DOCUMENT_COUNT_BY_ORGANIZATIONS' 
        },
        { 
            id: '5', 
            checkLevel: 'is_division',
            title: 'document_divisions', 
            type: 'document-by-divisions', 
            reportType: 'documentkh', 
            endurl: 'document-count-by-divisions', 
            riskItemId: 'division_ids', 
            riskTypeValue: 'division', 
            tabletiltle: 'division', 
            activityname: 'EXPORT_DOCUMENT_COUNT_BY_DIVISIONS'
        },
        { 
            id: '6', 
            checkLevel: 'is_department',
            title: 'document_departments', 
            type: 'document-by-departments', 
            reportType: 'documentkh', 
            endurl: 'document-count-by-departments', 
            riskItemId: 'department_ids', 
            riskTypeValue: 'department', 
            tabletiltle: 'department', 
            activityname: 'EXPORT_DOCUMENT_COUNT_BY_DEPARTMENTS'
        },
        { 
            id: '7', 
            checkLevel: 'is_section',
            title: 'document_sections', 
            type: 'document-by-sections', 
            reportType: 'documentkh', 
            endurl: 'document-count-by-sections', 
            riskItemId: 'section_ids', 
            riskTypeValue: 'section', 
            tabletiltle: 'section', 
            activityname: 'EXPORT_DOCUMENT_COUNT_BY_SECTIONS'
        },
        { 
            id: '8', 
            checkLevel: 'is_sub_section',
            title: 'document_sub_sections', 
            type: 'document-by-sub-sections', 
            reportType: 'documentkh', 
            endurl: 'document-count-by-sub-sections', 
            riskItemId: 'sub_section_ids', 
            riskTypeValue: 'sub_section', 
            tabletiltle: 'sub_section', 
            activityname: 'EXPORT_DOCUMENT_COUNT_BY_SUB_SECTIONS'
        },
        
    ];
    @observable
    private _khReportsList: KHReport[] = [];

    @observable
    private _khRiskCountDetails: KHRiskDetails[] = [];

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
    khRiskListingTableTitle: string;

    @observable
    selectedReportObject: KHReportList = null;

    @action
    setKHRiskDetails(response: any) {
        this._khReportsList = response;
        this.reportloaded = true;
    }

    @action
    setKHRiskCountDetails(response: KHRiskDetailsPaginationResponse) {
        this._khRiskCountDetails = response.data;
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
    setKHRiskListingTableTitle(khRiskListingTableTitle: string) {
        this.khRiskListingTableTitle = `Knowledge Hub by ${khRiskListingTableTitle}`;
    }

    @action
    khReportlistmakeEmpty() {
        this._khReportsList = [];
        this.reportloaded = false;
    }

    @action
    khRisktlistmakeEmpty() {
        this._khRiskCountDetails = [];
        this.listloaded = false;
    }

    @action
    setRiskId(id: string) {
        this.riskId = id;
    }

    @computed
    get getKHRiskListingTableTitle(): string {
        
        return this.khRiskListingTableTitle;
    }


    @computed
    get allItems(): KHReport[] {

        return this._khReportsList.slice();
    }

    @computed
    get KHRiskItemsDetails(): KHRiskDetails[] {

        return this._khRiskCountDetails.slice();
    }

    @computed
    get KHReportListArray(): KHReportList[] {

        return this.reportLists;
    }


}

export const KHReportStore = new Store();




