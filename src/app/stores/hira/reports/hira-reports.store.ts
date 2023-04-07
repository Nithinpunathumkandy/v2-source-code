import { observable, action, computed } from "mobx-angular";
import { Reports, RiskDetails, RiskDetailsPaginationResponse, ReportList} from 'src/app/core/models/risk-management/reports/report-details';
class Store {
    reportLists: ReportList[] = [
        { 
            id: '1', 
            checkLevel: 'is_department',
            title: 'risk_by_department', 
            type: 'risk-by-department', 
            reportType: 'riskRegister', 
            endurl: 'risk-count-by-departments', 
            riskItemId: 'department_ids', 
            riskTypeValue: 'department', 
            tabletiltle: 'department', 
            activityname: 'EXPORT_RISK_COUNT_BY_DEPARTMENTS' 
        },
        { 
            id: '2', 
            checkLevel: 'is_division',
            title: 'risk_by_division', 
            type: 'risk-by-division', 
            reportType: 'riskRegister', 
            endurl: 'risk-count-by-divisions', 
            riskItemId: 'division_ids', 
            riskTypeValue: 'division', 
            tabletiltle: 'division', 
            activityname: 'EXPORT_RISK_COUNT_BY_DIVISIONS' 
        },
        { 
            id: '3', 
            checkLevel: 'is_section',
            title: 'risk_by_section', 
            type: 'risk-by-section', 
            reportType: 'riskRegister', 
            endurl: 'risk-count-by-sections', 
            riskItemId: 'section_ids', 
            riskTypeValue: 'section', 
            tabletiltle: 'section', 
            activityname: 'EXPORT_RISK_COUNT_BY_SECTIONS' 
        },
        { 
            id: '4', 
            checkLevel: 'is_sub_section',
            title: 'risk_by_sub_section', 
            type: 'risk-by-sub-section', 
            reportType: 'riskRegister', 
            endurl: 'risk-count-by-sub-sections', 
            riskItemId: 'sub_section_ids', 
            riskTypeValue: 'sub_section', 
            tabletiltle: 'sub_sections', 
            activityname: 'EXPORT_RISK_COUNT_BY_SUB_SECTIONS' 
        },
        { 
            id: '5', 
            checkLevel: 'is_ms_type',
            title: 'risk_by_ms_type', 
            type: 'risk-by-ms-type', 
            reportType: 'riskRegister', 
            endurl: 'risk-count-by-ms-types', 
            riskItemId: 'ms_type_ids', 
            riskTypeValue: 'ms_types', 
            tabletiltle: 'ms_types', 
            activityname: 'EXPORT_RISK_COUNT_BY_MS_TYPES' 
        },
        { 
            id: '6', 
            title: 'risk_by_type', 
            type: 'risk-by-type', 
            reportType: 'riskRegister', 
            endurl: 'risk-count-by-risk-types', 
            riskItemId: 'risk_type_ids', 
            riskTypeValue: 'risk_type', 
            tabletiltle: 'risk_types', 
            activityname: 'EXPORT_RISK_COUNT_BY_RISK_TYPES' 
        },
        { 
            id: '7', 
            title: 'risk_by_category', 
            type: 'risk-by-category', 
            reportType: 'riskRegister', 
            endurl: 'risk-count-by-risk-categories', 
            riskItemId: 'risk_category_ids', 
            riskTypeValue: 'risk_category', 
            tabletiltle: 'risk_category', 
            activityname: 'EXPORT_RISK_COUNT_BY_RISK_CATEGORIES' 
        },
        { 
            id: '8', 
            title: 'risk_by_owner', 
            type: 'risk-by-owner', 
            reportType: 'riskRegister', 
            endurl: 'risk-count-by-owners', 
            riskItemId: 'risk_owner_ids', 
            riskTypeValue: 'first_name',
            riskTypeValue2: 'last_name', 
            tabletiltle: 'risk_owner', 
            activityname: 'EXPORT_RISK_COUNT_BY_OWNERS' 
        },
        { 
            id: '9', 
            title: 'risk_by_respossible_user', 
            type: 'risk-by-responsible-user', 
            reportType: 'riskRegister', 
            endurl: 'risk-count-by-responsible-users', 
            riskItemId: 'risk_responsible_user_ids', 
            riskTypeValue: 'first_name',
            riskTypeValue2: 'last_name', 
            tabletiltle: 'responsible_user', 
            activityname: 'EXPORT_RISK_COUNT_BY_RESPONSIBLE_USERS'
        },
        { 
            id: '10', 
            title: 'risk_by_status', 
            type: 'risk-by-status', 
            reportType: 'riskRegister', 
            endurl: 'risk-count-by-statuses', 
            riskItemId: 'risk_status_ids', 
            riskTypeValue: 'risk_statuses', 
            tabletiltle: 'risk_status', 
            activityname: 'EXPORT_RISK_COUNT_BY_STATUSES' 
        },
        { 
            id: '11', 
            title: 'risk_by_source', 
            type: 'risk-by-source', 
            reportType: 'riskRegister', 
            endurl: 'risk-count-by-sources', 
            riskItemId: 'risk_source_ids', 
            riskTypeValue: 'risk_sources', 
            tabletiltle: 'risk_source', 
            activityname: 'EXPORT_RISK_COUNT_BY_SOURCES' 
        },
        { 
            id: '12', 
            title: 'risk_by_area', 
            type: 'risk-by-areas', 
            reportType: 'riskRegister', 
            endurl: 'risk-count-by-areas', 
            riskItemId: 'risk_area_ids', 
            riskTypeValue: 'risk_areas', 
            tabletiltle: 'risk_areas', 
            activityname: 'EXPORT_RISK_COUNT_BY_AREAS' 
        },
        { 
            id: '13', 
            title: 'risk_by_inherent_risk_rating', 
            type: 'risk-by-inherent-risk-rating', 
            reportType: 'riskRegister', 
            endurl: 'risk-count-by-inherent-risk-ratings', 
            riskItemId: 'inherent_risk_rating_ids', 
            riskTypeValue: 'risk_ratings', 
            tabletiltle: 'inherent_risk_rating', 
            activityname: 'EXPORT_RISK_COUNT_BY_INHERENT_RISK_RATINGS' 
        },
        { 
            id: '14', 
            title: 'risk_by_residual_risk_rating', 
            type: 'risk-by-residual-risk-rating', 
            reportType: 'riskRegister', 
            endurl: 'risk-count-by-residual-risk-ratings', 
            riskItemId: 'residual_risk_rating_ids', 
            riskTypeValue: 'risk_ratings', 
            tabletiltle: 'residual_risk_rating', 
            activityname: 'EXPORT_RISK_COUNT_BY_RESIDUAL_RISK_RATINGS' 
        },
        { 
            id: '15', 
            analysisId: 'risk_score',
            title: 'risk_by_risk_score_inherent', 
            type: 'risks-by-risk-score-inherent', 
            reportType: 'riskRegister', 
            endurl: 'risk-count-by-inherent-scores', 
            riskItemId: 'inherent_risk_score', 
            riskTypeValue: 'risk_score', 
            tabletiltle: 'inherent_risk_score', 
            activityname: 'EXPORT_RISK_COUNT_BY_INHERENT_SCORES' 
        },
        { 
            id: '16', 
            analysisId: 'risk_score',
            title: 'risk_by_risk_score_residual', 
            type: 'risks-by-risk-score-residual', 
            reportType: 'riskRegister', 
            endurl: 'risk-count-by-residual-scores', 
            riskItemId: 'residual_risk_score', 
            riskTypeValue: 'risk_score', 
            tabletiltle: 'residual_risk_score', 
            activityname: 'EXPORT_RISK_COUNT_BY_RESIDUAL_SCORES' 
        },
        { 
            id: '17', 
            title: 'risk_by_risk_control_plan', 
            type: 'risk-by-risk-control-plan', 
            reportType: 'riskRegister', 
            endurl: 'risk-count-by-risk-control-plans', 
            riskItemId: 'risk_control_plan_ids', 
            riskTypeValue: 'control_plan', 
            tabletiltle: 'control_plan', 
            activityname: 'EXPORT_RISK_COUNT_BY_RISK_CONTROL_PLANS' 
        },
        { 
            id: '18', 
            title: 'risk_treatment_by_status', 
            type: 'risk-by-treatment-status', 
            reportType: 'riskTreatment', 
            endurl: 'risk-treatment-count-by-statuses', 
            riskItemId: 'risk_treatment_status_ids', 
            riskTypeValue: 'risk_treatment_statuses', 
            tabletiltle: 'treatment_status', 
            activityname: 'EXPORT_RISK_TREATMENT_COUNT_BY_STATUSES' 
        },
        { 
            id: '19', 
            title: 'risk_treatment_by_responssible_user', 
            type: 'risk-by-treatment-responsible-user', 
            reportType: 'riskTreatment', 
            endurl: 'risk-treatment-count-by-responsible-users', 
            riskItemId: 'risk_treatment_responsible_user_ids', 
            riskTypeValue: 'first_name',
            riskTypeValue2: 'last_name', 
            tabletiltle: 'treatment_responsible_user', 
            activityname: 'EXPORT_RISK_TREATMENT_COUNT_BY_RESPONSIBLE_USERS' 
        },
        { 
            id: '20', 
            title: 'risk_by_products', 
            type: 'risk-by-products', 
            reportType: 'riskRegister', 
            endurl: 'risk-count-by-products', 
            riskItemId: 'product_ids', 
            riskTypeValue: 'product',
            tabletiltle: 'product', 
            activityname: 'EXPORT_RISK_COUNT_BY_PRODUCTS' 
        },
        { 
            id: '21', 
            title: 'risk_count_by_strategic_objectives', 
            type: 'risk-count-by-strategic-objectives', 
            reportType: 'riskRegister', 
            endurl: 'risk-count-by-strategic-objectives', 
            riskItemId: 'strategic_objective_ids', 
            riskTypeValue: 'strategic_objective',
            tabletiltle: 'strategic_objective', 
            activityname: 'EXPORT_RISK_COUNT_BY_PRODUCTS' 
        }
    ];
    @observable
    private _reportsList: Reports[] = [];

    @observable
    private _riskCountDetails: RiskDetails[] = [];

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
    riskListingTableTitle: string;

    @observable
    selectedReportObject: ReportList = null;

    @action
    setRiskDetails(response: any) {
        this._reportsList = response;
        this.reportloaded = true;
    }

    @action
    setRiskCountDetails(response: RiskDetailsPaginationResponse) {
        this._riskCountDetails = response.data;
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
    setRiskListingTableTitle(riskListingTableTitle: string) {
        this.riskListingTableTitle = `Risk by ${riskListingTableTitle}`;
    }

    @action
    reportlistmakeEmpty() {
        this._reportsList = [];
        this.reportloaded = false;
    }

    @action
    risktlistmakeEmpty() {
        this._riskCountDetails = [];
        this.listloaded = false;
    }

    @action
    setRiskId(id: string) {
        this.riskId = id;
    }

    @computed
    get RiskListingTableTitle(): string {
        
        return this.riskListingTableTitle;
    }


    @computed
    get allItems(): Reports[] {

        return this._reportsList.slice();
    }

    @computed
    get RiskItemsDetails(): RiskDetails[] {

        return this._riskCountDetails.slice();
    }

    @computed
    get ReportListArray(): ReportList[] {

        return this.reportLists;
    }

}

export const HiraReportStore = new Store();
