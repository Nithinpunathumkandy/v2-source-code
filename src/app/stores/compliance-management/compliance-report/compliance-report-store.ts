import { observable, action, computed } from "mobx-angular";
import { ComplianceReport, ComplianceReportDetails, ComplianceReportDetailsPaginationResponse,ComplianceReportPaginationResponse, ComplianceReportList} from 'src/app/core/models/compliance-management/compliance-report/compliance-report';
class Store {
    reportLists: ComplianceReportList[] = [
        { 
            id: '1', 
            checkLevel: 'is_section',
            title: 'compliance_by_sections', 
            type: 'compliance-by-setions', 
            reportType: 'compliance', 
            endurl: 'compliance-count-by-setions', 
            riskItemId: 'document_compliance_section_ids', 
            riskTypeValue: 'title', 
            tabletiltle: 'section', 
            activityname: 'EXPORT_REPORT_COMPLIANCE_COUNT_BY_SECTIONS',
            listPermission: 'EXPORT_COMPLIANCE_REGISTER'
        },
        { 
            id: '2', 
            title: 'compliance_by_types', 
            type: 'compliance-by-types', 
            reportType: 'compliance', 
            endurl: 'compliance-count-by-types', 
            riskItemId: 'document_compliance_document_type_ids', 
            riskTypeValue: 'title',
            tabletiltle: 'compliance_type', 
            activityname: 'EXPORT_REPORT_COMPLIANCE_COUNT_BY_TYPES',
            listPermission: 'EXPORT_COMPLIANCE_REGISTER' 
        },
        { 
            id: '3', 
            title: 'compliance_by_frequencies', 
            type: 'compliance-by-frequencies', 
            reportType: 'compliance', 
            endurl: 'compliance-count-by-frequencies', 
            riskItemId: 'compliance_frequency_ids', 
            riskTypeValue: 'title',  
            tabletiltle: 'frequency', 
            activityname: 'EXPORT_REPORT_COMPLIANCE_COUNT_BY_FREQUENCY',
            listPermission: 'EXPORT_COMPLIANCE_REGISTER' 
        },
        { 
            id: '4', 
            title: 'compliance_by_statuses', 
            type: 'compliance-by-statuses', 
            reportType: 'compliance', 
            endurl: 'compliance-count-by-statuses', 
            riskItemId: 'compliance_status_ids', 
            riskTypeValue: 'title', 
            tabletiltle: 'status', 
            activityname: 'EXPORT_REPORT_COMPLIANCE_COUNT_BY_STATUS',
            listPermission: 'EXPORT_COMPLIANCE_REGISTER' 
        },
        { 
            id: '5', 
            title: 'compliance_by_products', 
            type: 'compliance-by-products', 
            reportType: 'compliance', 
            endurl: 'compliance-count-by-products', 
            riskItemId: 'product_ids', 
            riskTypeValue: 'title', 
            tabletiltle: 'product', 
            activityname: 'EXPORT_REPORT_COMPLIANCE_COUNT_BY_PRODUCTS',
            listPermission: 'EXPORT_COMPLIANCE_REGISTER' 
        },
        { 
            id: '6', 
            title: 'compliance_by_owner', 
            type: 'compliance-by-owner', 
            reportType: 'compliance', 
            endurl: 'compliance-count-by-owners', 
            riskItemId: 'user_ids', 
            riskTypeValue: 'responsible_user', 
            tabletiltle: 'cr_owner_title', 
            activityname: 'EXPORT_REPORT_COMPLIANCE_COUNT_BY_OWNER',
            listPermission: 'EXPORT_COMPLIANCE_REGISTER' 
        },
        { 
            id: '7', 
            title: 'sla_by_categories', 
            type: 'sla-by-categories', 
            reportType: 'sla', 
            endurl: 'sla-count-by-categories', 
            riskItemId: 'sla_category_ids', 
            riskTypeValue: 'title', 
            tabletiltle: 'category', 
            activityname: 'EXPORT_REPORT_SLA_AND_CONTRACT_COUNT_BY_CATEGORY',
            listPermission: 'EXPORT_SERVICE_LEVEL_AGREEMENT_AND_CONTRACT'
        },
        { 
            id: '8', 
            checkLevel: 'is_department',
            title: 'sla_by_departments', 
            type: 'sla-by-departments', 
            reportType: 'sla', 
            endurl: 'sla-count-by-departments', 
            riskItemId: 'department_ids', 
            riskTypeValue: 'title', 
            tabletiltle: 'department', 
            activityname: 'EXPORT_REPORT_SLA_AND_CONTRACT_COUNT_BY_DEPARTMENT',
            listPermission: 'EXPORT_SERVICE_LEVEL_AGREEMENT_AND_CONTRACT'
        },
        { 
            id: '9', 
            title: 'sla_by_statuses', 
            type: 'sla-by-statuses', 
            reportType: 'sla', 
            endurl: 'sla-count-by-statuses', 
            riskItemId: 'sla_status_ids', 
            riskTypeValue: 'title', 
            tabletiltle: 'status', 
            activityname: 'EXPORT_REPORT_SLA_AND_CONTRACT_COUNT_BY_STATUS',
            listPermission: 'EXPORT_SERVICE_LEVEL_AGREEMENT_AND_CONTRACT'
        },
        { 
            id: '10', 
            title: 'sla_by_products', 
            type: 'sla-by-products', 
            reportType: 'sla', 
            endurl: 'sla-count-by-products', 
            riskItemId: 'product_ids', 
            riskTypeValue: 'title', 
            tabletiltle: 'product', 
            activityname: 'EXPORT_REPORT_SLA_AND_CONTRACT_COUNT_BY_PRODUCTS',
            listPermission: 'EXPORT_SERVICE_LEVEL_AGREEMENT_AND_CONTRACT'
        },
        { 
            id: '11', 
            title: 'compliance_by_departments', 
            type: 'compliance-by-departments', 
            reportType: 'compliance', 
            endurl: 'compliance-count-by-departments', 
            riskItemId: 'department_ids', 
            riskTypeValue: 'title', 
            tabletiltle: 'department', 
            activityname: 'EXPORT_REPORT_COMPLIANCE_COUNT_BY_DEPARTMENT',
            listPermission: 'EXPORT_COMPLIANCE_REGISTER'
        },
        { 
            id: '12', 
            checkLevel: 'is_subsidiary',
            title: 'compliance_by_organizations', 
            type: 'compliance-by-organizations', 
            reportType: 'compliance', 
            endurl: 'compliance-count-by-organizations', 
            riskItemId: 'organization_ids', 
            riskTypeValue: 'title', 
            tabletiltle: 'organization', 
            activityname: 'EXPORT_REPORT_COMPLIANCE_COUNT_BY_ORGANIZATION',
            listPermission: 'EXPORT_COMPLIANCE_REGISTER'
        },
        { 
            id: '13', 
            checkLevel: 'is_subsidiary',
            title: 'sla_by_organizations', 
            type: 'sla-by-organizations', 
            reportType: 'sla', 
            endurl: 'sla-count-by-organizations', 
            riskItemId: 'organization_ids', 
            riskTypeValue: 'title', 
            tabletiltle: 'owner', 
            activityname: 'EXPORT_REPORT_SLA_AND_CONTRACT_COUNT_BY_OWNER',
            listPermission: 'EXPORT_SERVICE_LEVEL_AGREEMENT_AND_CONTRACT'
        },
        { 
            id: '14', 
            title: 'sla_by_owners', 
            type: 'sla-by-owners', 
            reportType: 'sla', 
            endurl: 'sla-count-by-owners', 
            riskItemId: 'user_ids', 
            riskTypeValue: 'responsible_user', 
            tabletiltle: 'cr_owner_title', 
            activityname: 'EXPORT_REPORT_SLA_AND_CONTRACT_COUNT_BY_ORGANIZATION',
            listPermission: 'EXPORT_SERVICE_LEVEL_AGREEMENT_AND_CONTRACT'
        }
        
    ];
    @observable
    private _complianceReportsList: ComplianceReport[] = [];

    @observable
    private _complianceReportsCountDetails: ComplianceReportDetails[] = [];

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
    complianceReportDetailsListingTableTitle: string;

    @observable
    selectedReportObject: ComplianceReportList = null;

    @action
    setComplianceReportDetails(response: any) {
        this._complianceReportsList = response;
        this.reportloaded = true;
    }

    @action
    setComplianceReportsCountDetails(response: ComplianceReportDetailsPaginationResponse) {
        this._complianceReportsCountDetails = response.data;
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
    setComplianceReportDetailsListingTableTitle(complianceReportDetailsListingTableTitle: string) {
        this.complianceReportDetailsListingTableTitle = this.selectedReportObject.reportType == 'compliance' ? `Compliance by ${complianceReportDetailsListingTableTitle}` : `SLA by ${complianceReportDetailsListingTableTitle}`;
    }

    @action
    ComplianceReportlistmakeEmpty() {
        this._complianceReportsList = [];
        this.reportloaded = false;
    }

    @action
    ComplianceReportDetailslistmakeEmpty() {
        this._complianceReportsCountDetails = [];
        this.listloaded = false;
    }

    @action
    setRiskId(id: string) {
        this.riskId = id;
    }

    @computed
    get getComplianceReportDetailsListingTableTitle(): string {
        
        return this.complianceReportDetailsListingTableTitle;
    }


    @computed
    get allItems(): ComplianceReport[] {

        return this._complianceReportsList.slice();
    }

    @computed
    get ComplianceReportsItemsDetails(): ComplianceReportDetails[] {

        return this._complianceReportsCountDetails.slice();
    }

    @computed
    get ComplianceReportListArray(): ComplianceReportList[] {

        return this.reportLists;
    }


}

export const ComplianceReportStore = new Store();




