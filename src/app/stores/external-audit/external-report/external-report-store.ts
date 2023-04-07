import { observable, action, computed } from "mobx-angular";
import { ExternalReport, ExternalRiskDetails, ExternalRiskDetailsPaginationResponse,ExternalReportPaginationResponse, ExternalReportList} from 'src/app/core/models/external-audit/external-report/external-report';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
class Store {
    reportLists: ExternalReportList[] = [
        { 
            id: '1', 
            title: 'external_audit_by_types', 
            type: 'external-audit-by-types', 
            reportType: 'externalAudit', 
            endurl: 'external-audit-count-by-types', 
            riskItemId: 'external_audit_type_ids', 
            riskTypeValue: 'external_audit_type', 
            tabletiltle: 'types', 
            activityname: 'EXPORT_EXTERNAL_AUDIT_COUNT_BY_TYPES',
            listPermission: 'EXPORT_EXTERNAL_AUDIT'
        },
        { 
            id: '2', 
            title: 'external_audit_statuses', 
            type: 'external-audit-by-statuses', 
            reportType: 'externalAudit', 
            endurl: 'external-audit-count-by-statuses', 
            riskItemId: 'status_ids', 
            riskTypeValue: 'status',
            tabletiltle: 'status', 
            activityname: 'EXPORT_EXTERNAL_AUDIT_COUNT_BY_STATUSES',
            listPermission: 'EXPORT_EXTERNAL_AUDIT' 
        },
        { 
            id: '3', 
            title: 'external_audit_responsible_users', 
            type: 'external-audit-by-responsible-users', 
            reportType: 'externalAudit', 
            endurl: 'external-audit-count-by-responsible-users', 
            riskItemId: 'responsible_user_ids', 
            riskTypeValue: 'first_name', 
            riskTypeValue2: 'last_name', 
            tabletiltle: 'responsible_user', 
            activityname: 'EXPORT_EXTERNAL_AUDIT_COUNT_BY_RESPONSIBLE_USERS',
            listPermission: 'EXPORT_EXTERNAL_AUDIT' 
        },
        { 
            id: '4', 
            checkLevel: 'is_ms_type',
            title: 'external_audit_ms_types', 
            type: 'external-audit-by-ms-types', 
            reportType: 'externalAudit', 
            endurl: 'external-audit-count-by-ms-types', 
            riskItemId: 'ms_type_ids', 
            riskTypeValue: 'ms_types', 
            tabletiltle: 'ms_type', 
            activityname: 'EXPORT_EXTERNAL_AUDIT_COUNT_BY_MS_TYPES',
            listPermission: 'EXPORT_EXTERNAL_AUDIT' 
        },
        { 
            id: '5', 
            title: 'finding_categories', 
            type: 'finding-by-categories', 
            reportType: 'finding', 
            endurl: 'finding-count-by-categories', 
            riskItemId: 'finding_category_ids', 
            riskTypeValue: 'finding_category', 
            tabletiltle: 'category', 
            activityname: 'EXPORT_EA_FINDING_COUNT_BY_CATEGORIES',
            listPermission: 'EXPORT_EA_FINDING'
        },
        { 
            id: '6', 
            title: 'finding_status', 
            type: 'finding-by-statuses', 
            reportType: 'finding', 
            endurl: 'finding-count-by-statuses', 
            riskItemId: 'finding_status_ids', 
            riskTypeValue: 'finding_status', 
            tabletiltle: 'status', 
            activityname: 'EXPORT_EA_FINDING_COUNT_BY_STATUSES',
            listPermission: 'EXPORT_EA_FINDING'
        },
        { 
            id: '7', 
            title: 'finding_impact_analysis_categories', 
            type: 'finding-by-impact-analysis-categories', 
            reportType: 'finding', 
            endurl: 'finding-count-by-impact-analysis-categories', 
            riskItemId: 'impact_analysis_category_ids', 
            riskTypeValue: 'impact_analysis_category', 
            tabletiltle: 'impact_analysis_category', 
            activityname: 'EXPORT_EA_FINDING_COUNT_BY_IMPACT_ANALYSIS_CATEGORIES',
            listPermission: 'EXPORT_EA_FINDING'
        },
        { 
            id: '8', 
            title: 'finding_root_cause_categories', 
            type: 'finding-by-root-cause-categories', 
            reportType: 'finding', 
            endurl: 'finding-count-by-root-cause-categories', 
            riskItemId: 'root_cause_category_ids', 
            riskTypeValue: 'root_cause_category', 
            tabletiltle: 'root_cause_category', 
            activityname: 'EXPORT_EA_FINDING_COUNT_BY_ROOT_CAUSE_CATEGORIES',
            listPermission: 'EXPORT_EA_FINDING'
        },
        { 
            id: '9', 
            title: 'finding_root_cause_sub_categories', 
            type: 'finding-by-root-cause-sub-categories', 
            reportType: 'finding', 
            endurl: 'finding-count-by-root-cause-sub-categories', 
            riskItemId: 'root_cause_sub_category_ids', 
            riskTypeValue: 'root_cause_sub_category', 
            tabletiltle: 'root_cause_sub_category', 
            activityname: 'EXPORT_EA_FINDING_COUNT_BY_ROOT_CAUSE_SUB_CATEGORIES',
            listPermission: 'EXPORT_EA_FINDING'
        },
        { 
            id: '10', 
            title: 'finding_corrective_action_status', 
            type: 'finding-by-corrective-action-statuses', 
            reportType: 'finding', 
            endurl: 'finding-count-by-corrective-action-statuses', 
            riskItemId: 'corrective_action_status_ids', 
            riskTypeValue: 'corrective_action_status', 
            tabletiltle: 'status', 
            activityname: 'EXPORT_EA_FINDING_COUNT_BY_CORRECTIVE_ACTION_STATUSES',
            listPermission: 'EXPORT_EA_FINDING'
        },
        { 
            id: '11', 
            title: 'finding_risk_ratings', 
            type: 'finding-by-risk-ratings', 
            reportType: 'finding', 
            endurl: 'finding-count-by-risk-ratings', 
            riskItemId: 'risk_rating_ids', 
            riskTypeValue: 'risk_rating', 
            tabletiltle: 'risk_rating', 
            activityname: 'EXPORT_EA_FINDING_COUNT_BY_RISK_RATINGS',
            listPermission: 'EXPORT_EA_FINDING'
        },
        
        
    ];
    @observable
    private _externalReportsList: ExternalReport[] = [];

    @observable
    private _externalRiskCountDetails: ExternalRiskDetails[] = [];

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
    externalRiskListingTableTitle: string;

    @observable
    selectedReportObject: ExternalReportList = null;

    @action
    setExternalRiskDetails(response: any) {
        this._externalReportsList = response;
        this.reportloaded = true;
    }

    @action
    setExternalRiskCountDetails(response: ExternalRiskDetailsPaginationResponse) {
        this._externalRiskCountDetails = response.data;
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
    setExternalRiskListingTableTitle(externalRiskListingTableTitle: string) {
        this.externalRiskListingTableTitle = this.selectedReportObject.reportType == 'externalAudit' ? `Audits by ${externalRiskListingTableTitle}` : `Audit Findings by ${externalRiskListingTableTitle}`;
    }

    @action
    externalReportlistmakeEmpty() {
        this._externalReportsList = [];
        this.reportloaded = false;
    }

    @action
    externalRisktlistmakeEmpty() {
        this._externalRiskCountDetails = [];
        this.listloaded = false;
    }

    @action
    setRiskId(id: string) {
        this.riskId = id;
    }

    @computed
    get getExternalRiskListingTableTitle(): string {
        
        return this.externalRiskListingTableTitle;
    }


    @computed
    get allItems(): ExternalReport[] {

        return this._externalReportsList.slice();
    }

    @computed
    get ExternalRiskItemsDetails(): ExternalRiskDetails[] {

        return this._externalRiskCountDetails.slice();
    }

    @computed
    get ExternalReportListArray(): ExternalReportList[] {

        return this.reportLists;
    }


}

export const ExternalReportStore = new Store();




