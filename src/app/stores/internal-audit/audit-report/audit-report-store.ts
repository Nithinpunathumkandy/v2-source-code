import { observable, action, computed } from "mobx-angular";
import { AuditReports, AuditRiskDetails, AuditRiskDetailsPaginationResponse,AuditReportsPaginationResponse, AuditReportList} from 'src/app/core/models/internal-audit/audit-reports/audit-report';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
class Store {
    reportLists: AuditReportList[] = [
        { 
            id: '1', 
            title: 'audit_program_by_auditable_items', 
            type: 'audit-program-by-auditable-items', 
            reportType: 'auditProgram', 
            endurl: 'audit-program-count-by-auditable-items', 
            riskItemId: 'auditable_item_ids', 
            riskTypeValue: 'auditable_item', 
            tabletiltle: 'auditable_items', 
            activityname: 'EXPORT_AUDIT_PROGRAM_COUNT_BY_AUDITABLE_ITEMS',
            listPermission: 'EXPORT_AUDIT_PROGRAM' 
        },
        { 
            id: '2', 
            title: 'audit_program_by_auditors', 
            type: 'audit-program-by-auditors', 
            reportType: 'auditProgram', 
            endurl: 'audit-program-count-by-auditors', 
            riskItemId: 'auditor_ids', 
            riskTypeValue: 'auditor_first_name', 
            riskTypeValue2: 'auditor_last_name',
            tabletiltle: 'auditor', 
            activityname: 'EXPORT_AUDIT_PROGRAM_COUNT_BY_AUDITORS',
            listPermission: 'EXPORT_AUDIT_PROGRAM' 
        },
        { 
            id: '3', 
            title: 'audit_program_by_statuses', 
            type: 'audit-program-by-statuses', 
            reportType: 'auditProgram', 
            endurl: 'audit-program-count-by-statuses', 
            riskItemId: 'audit_program_status_ids', 
            riskTypeValue: 'status', 
            tabletiltle: 'status', 
            activityname: 'EXPORT_AUDIT_PROGRAM_COUNT_BY_STATUSES',
            listPermission: 'EXPORT_AUDIT_PROGRAM' 
        },
        { 
            id: '4', 
            checkLevel: 'is_department',
            title: 'audit_by_departments', 
            type: 'audit-by-departments', 
            reportType: 'audit', 
            endurl: 'audit-count-by-departments', 
            riskItemId: 'audit_department_ids', 
            riskTypeValue: 'department', 
            tabletiltle: 'departments', 
            activityname: 'EXPORT_AUDIT_COUNT_BY_DEPARTMENTS',
            listPermission: 'EXPORT_AUDIT' 
        },
        { 
            id: '5', 
            checkLevel: 'is_section',
            title: 'audit_by_sections', 
            type: 'audit-by-sections', 
            reportType: 'audit', 
            endurl: 'audit-count-by-sections', 
            riskItemId: 'audit_section_ids', 
            riskTypeValue: 'section', 
            tabletiltle: 'sections', 
            activityname: 'EXPORT_AUDIT_COUNT_BY_SECTIONS',
            listPermission: 'EXPORT_AUDIT' 
        },
        { 
            id: '6', 
            checkLevel: 'is_sub_section',
            title: 'audit_by_sub_sections', 
            type: 'audit-by-sub-sections', 
            reportType: 'audit', 
            endurl: 'audit-count-by-sub-sections', 
            riskItemId: 'audit_sub_sections', 
            riskTypeValue: 'sub_section', 
            tabletiltle: 'sub_sections', 
            activityname: 'EXPORT_AUDIT_COUNT_BY_SUB_SECTIONS',
            listPermission: 'EXPORT_AUDIT' 
        },
        { 
            id: '7', 
            checkLevel: 'is_division',
            title: 'audit_by_divisions', 
            type: 'audit-by-divisions', 
            reportType: 'audit', 
            endurl: 'audit-count-by-divisions', 
            riskItemId: 'audit_division_ids', 
            riskTypeValue: 'division', 
            tabletiltle: 'division', 
            activityname: 'EXPORT_AUDIT_COUNT_BY_DIVISIONS',
            listPermission: 'EXPORT_AUDIT' 
        },
        { 
            id: '8', 
            title: 'audit_by_categories', 
            type: 'audit-by-categories', 
            reportType: 'audit', 
            endurl: 'audit-count-by-categories', 
            riskItemId: 'audit_category_ids', 
            riskTypeValue: 'audit_category',  
            tabletiltle: 'category', 
            activityname: 'EXPORT_AUDIT_COUNT_BY_CATEGORIES',
            listPermission: 'EXPORT_AUDIT' 
        },
        { 
            id: '9', 
            title: 'audit_by_criteria', 
            type: 'audit-by-criteria', 
            reportType: 'audit', 
            endurl: 'audit-count-by-criteria', 
            riskItemId: 'audit_criteria_ids', 
            riskTypeValue: 'audit_criteria', 
            tabletiltle: 'criteria', 
            activityname: 'EXPORT_AUDIT_COUNT_BY_CRITERIA',
            listPermission: 'EXPORT_AUDIT' 
        },
        { 
            id: '10', 
            checkLevel: 'is_subsidiary',
            title: 'audit_by_organizations', 
            type: 'audit-by-organizations', 
            reportType: 'audit', 
            endurl: 'audit-count-by-organizations', 
            riskItemId: 'audit_organization_ids', 
            riskTypeValue: 'organization', 
            tabletiltle: 'organization', 
            activityname: 'EXPORT_AUDIT_COUNT_BY_ORGANIZATIONS',
            listPermission: 'EXPORT_AUDIT'
        },
        { 
            id: '11', 
            title: 'audit_by_audit_leaders', 
            type: 'audit-audit-leaders', 
            reportType: 'audit', 
            endurl: 'audit-count-by-audit-leaders', 
            riskItemId: 'audit_leaders', 
            riskTypeValue: 'first_name',
            riskTypeValue2: 'last_name', 
            tabletiltle: 'audit_leader', 
            activityname: 'EXPORT_AUDIT_COUNT_BY_AUDIT_LEADERS',
            listPermission: 'EXPORT_AUDIT'
        },
        { 
            id: '12', 
            title: 'audit_by_auditee_leaders', 
            type: 'audit-by-auditee-leaders', 
            reportType: 'audit', 
            endurl: 'audit-count-by-auditee-leaders', 
            riskItemId: 'auditee_leaders', 
            riskTypeValue: 'first_name',
            riskTypeValue2: 'last_name', 
            tabletiltle: 'auditees_leader', 
            activityname: 'EXPORT_AUDIT_COUNT_BY_AUDITEE_LEADERS',
            listPermission: 'EXPORT_AUDIT'
        },
        { 
            id: '13', 
            title: 'audit_by_objectives', 
            type: 'audit-by-objectives', 
            reportType: 'audit', 
            endurl: 'audit-count-by-objectives', 
            riskItemId: 'audit_objective_ids', 
            riskTypeValue: 'audit_objective', 
            tabletiltle: 'objectives', 
            activityname: 'EXPORT_AUDIT_COUNT_BY_OBJECTIVES',
            listPermission: 'EXPORT_AUDIT'
        },
        { 
            id: '14', 
            title: 'audit_by_types', 
            type: 'audit-by-types', 
            reportType: 'audit', 
            endurl: 'audit-count-by-types', 
            riskItemId: 'audit_type_ids', 
            riskTypeValue: 'audit_type', 
            tabletiltle: 'types', 
            activityname: 'EXPORT_AUDIT_COUNT_BY_TYPES',
            listPermission: 'EXPORT_AUDIT'
        },
        { 
            id: '15', 
            title: 'audit_by_statuses', 
            type: 'audit-by-statuses', 
            reportType: 'audit', 
            endurl: 'audit-count-by-statuses', 
            riskItemId: 'audit_status_ids', 
            riskTypeValue: 'audit_status', 
            tabletiltle: 'status', 
            activityname: 'EXPORT_AUDIT_COUNT_BY_STATUSES',
            listPermission: 'EXPORT_AUDIT'
        },
        { 
            id: '16', 
            title: 'finding_auditable_items', 
            type: 'finding-by-auditable-items', 
            reportType: 'auditFinding', 
            endurl: 'finding-count-by-auditable-items', 
            riskItemId: 'auditable_item_ids', 
            riskTypeValue: 'auditable_item', 
            tabletiltle: 'auditable_items', 
            activityname: 'EXPORT_FINDING_COUNT_BY_AUDITABLE_ITEMS',
            listPermission: 'EXPORT_FINDING'
        },
        { 
            id: '17', 
            title: 'finding_categories', 
            type: 'finding-by-categories', 
            reportType: 'auditFinding', 
            endurl: 'finding-count-by-categories', 
            riskItemId: 'finding_category_ids', 
            riskTypeValue: 'finding_category', 
            tabletiltle: 'category', 
            activityname: 'EXPORT_FINDING_COUNT_BY_CATEGORIES',
            listPermission: 'EXPORT_FINDING'
        },
        { 
            id: '18', 
            title: 'finding_statuses', 
            type: 'finding-by-statuses', 
            reportType: 'auditFinding', 
            endurl: 'finding-count-by-statuses', 
            riskItemId: 'finding_status_ids', 
            riskTypeValue: 'finding_status', 
            tabletiltle: 'status', 
            activityname: 'EXPORT_FINDING_COUNT_BY_STATUSES',
            listPermission: 'EXPORT_FINDING'
        },
        { 
            id: '19', 
            title: 'finding_impact_analysis_categories', 
            type: 'finding-by-impact-analysis-categories', 
            reportType: 'auditFinding', 
            endurl: 'finding-count-by-impact-analysis-categories', 
            riskItemId: 'impact_analysis_category_ids', 
            riskTypeValue: 'impact_analysis_category', 
            tabletiltle: 'impact_analysis_category', 
            activityname: 'EXPORT_FINDING_COUNT_BY_IMPACT_ANALYSIS_CATEGORIES',
            listPermission: 'EXPORT_FINDING'
        },
        { 
            id: '20', 
            checkLevel: 'is_subsidiary',
            title: 'finding_organizations', 
            type: 'finding-by-organizations', 
            reportType: 'auditFinding', 
            endurl: 'finding-count-by-organizations', 
            riskItemId: 'organization_ids', 
            riskTypeValue: 'organization', 
            tabletiltle: 'organization', 
            activityname: 'EXPORT_FINDING_COUNT_BY_ORGANIZATIONS',
            listPermission: 'EXPORT_FINDING'
        },
        { 
            id: '21', 
            checkLevel: 'is_division',
            title: 'finding_divisions', 
            type: 'finding-by-divisions', 
            reportType: 'auditFinding', 
            endurl: 'finding-count-by-divisions', 
            riskItemId: 'division_ids', 
            riskTypeValue: 'division', 
            tabletiltle: 'division', 
            activityname: 'EXPORT_FINDING_COUNT_BY_DIVISIONS',
            listPermission: 'EXPORT_FINDING'
        },
        { 
            id: '22', 
            checkLevel: 'is_department',
            title: 'finding_departments', 
            type: 'finding-by-departments', 
            reportType: 'auditFinding', 
            endurl: 'finding-count-by-departments', 
            riskItemId: 'department_ids', 
            riskTypeValue: 'department', 
            tabletiltle: 'department', 
            activityname: 'EXPORT_FINDING_COUNT_BY_DEPARTMENTS',
            listPermission: 'EXPORT_FINDING'
        },
        { 
            id: '23', 
            checkLevel: 'is_section',
            title: 'finding_sections', 
            type: 'finding-by-sections', 
            reportType: 'auditFinding', 
            endurl: 'finding-count-by-sections', 
            riskItemId: 'section_ids', 
            riskTypeValue: 'section', 
            tabletiltle: 'section', 
            activityname: 'EXPORT_FINDING_COUNT_BY_SECTIONS',
            listPermission: 'EXPORT_FINDING'
        },
        { 
            id: '24', 
            checkLevel: 'is_sub_section',
            title: 'finding_sub_sections', 
            type: 'finding-by-sub-sections', 
            reportType: 'auditFinding', 
            endurl: 'finding-count-by-sub-sections', 
            riskItemId: 'sub_section_ids', 
            riskTypeValue: 'sub_section', 
            tabletiltle: 'sub_section', 
            activityname: 'EXPORT_FINDING_COUNT_BY_SUB_SECTIONS',
            listPermission: 'EXPORT_FINDING'
        },
        { 
            id: '25', 
            title: 'finding_root_cause_categories', 
            type: 'finding-by-root-cause-categories', 
            reportType: 'auditFinding', 
            endurl: 'finding-count-by-root-cause-categories', 
            riskItemId: 'root_cause_category_ids', 
            riskTypeValue: 'root_cause_category', 
            tabletiltle: 'root_cause_category', 
            activityname: 'EXPORT_FINDING_COUNT_BY_ROOT_CAUSE_CATEGORIES',
            listPermission: 'EXPORT_FINDING'
        },
        { 
            id: '26', 
            title: 'finding_root_cause_sub_categories', 
            type: 'finding-by-root-cause-sub-categories', 
            reportType: 'auditFinding', 
            endurl: 'finding-count-by-root-cause-sub-categories', 
            riskItemId: 'root_cause_sub_category_ids', 
            riskTypeValue: 'root_cause_sub_category', 
            tabletiltle: 'root_cause_sub_category', 
            activityname: 'EXPORT_FINDING_COUNT_BY_ROOT_CAUSE_SUB_CATEGORIES',
            listPermission: 'EXPORT_FINDING'
        },
        { 
            id: '27', 
            title: 'finding_corrective_action_statuses', 
            type: 'finding-by-corrective-action-statuses', 
            reportType: 'auditFinding', 
            endurl: 'finding-count-by-corrective-action-statuses', 
            riskItemId: 'corrective_action_status_ids', 
            riskTypeValue: 'corrective_action_status', 
            tabletiltle: 'status', 
            activityname: 'EXPORT_FINDING_COUNT_BY_CORRECTIVE_ACTION_STATUSES',
            listPermission: 'EXPORT_FINDING'
        },
        { 
            id: '28', 
            title: 'finding_risk_ratings', 
            type: 'finding-by-risk-ratings', 
            reportType: 'auditFinding', 
            endurl: 'finding-count-by-risk-ratings', 
            riskItemId: 'risk_rating_ids', 
            riskTypeValue: 'risk_rating', 
            tabletiltle: 'risk_rating', 
            activityname: 'EXPORT_FINDING_COUNT_BY_RISK_RATINGS',
            listPermission: 'EXPORT_FINDING'
        },
        
        
    ];
    @observable
    private _auditReportsList: AuditReports[] = [];

    @observable
    private _auditRiskCountDetails: AuditRiskDetails[] = [];

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
    auditRiskListingTableTitle: string;

    @observable
    selectedReportObject: AuditReportList = null;

    @action
    setAuditRiskDetails(response: any) {
        this._auditReportsList = response;
        this.reportloaded = true;
    }

    @action
    setAuditRiskCountDetails(response: AuditRiskDetailsPaginationResponse) {
        this._auditRiskCountDetails = response.data;
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
    setAuditRiskListingTableTitle(auditRiskListingTableTitle: string) {
        this.auditRiskListingTableTitle = this.selectedReportObject.reportType == 'audit' ? `Audits by ${auditRiskListingTableTitle}`
        : this.selectedReportObject.reportType == 'auditFinding' ? `Audit Findings by ${auditRiskListingTableTitle}` : `Audit Programs by ${auditRiskListingTableTitle}`;
    }

    @action
    auditReportlistmakeEmpty() {
        this._auditReportsList = [];
        this.reportloaded = false;
    }

    @action
    auditRisktlistmakeEmpty() {
        this._auditRiskCountDetails = [];
        this.listloaded = false;
    }

    @action
    setRiskId(id: string) {
        this.riskId = id;
    }

    @computed
    get getAuditRiskListingTableTitle(): string {
        
        return this.auditRiskListingTableTitle;
    }


    @computed
    get allItems(): AuditReports[] {

        return this._auditReportsList.slice();
    }

    @computed
    get AuditRiskItemsDetails(): AuditRiskDetails[] {

        return this._auditRiskCountDetails.slice();
    }

    @computed
    get AuditReportListArray(): AuditReportList[] {

        return this.reportLists;
    }


}

export const AuditReportStore = new Store();




