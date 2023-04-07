import { observable, action, computed } from "mobx-angular";
import { Reports, ReportDetails, ReportDetailsPaginationResponse, ReportList} from 'src/app/core/models/isms/report/report-details';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
class Store {
    reportLists: ReportList[] = [
        { 
            id: '1', 
            checkLevel: 'is_department',
            title: 'risk_by_department', 
            type: 'isms-risk-by-department', 
            reportType: 'riskRegister', 
            endurl: 'isms-risk-count-by-departments', 
            riskItemId: 'department_ids', 
            riskTypeValue: 'department', 
            tabletiltle: 'department', 
            activityname: 'EXPORT_ISMS_RISK_COUNT_BY_DEPARTMENTS' 
        },
        { 
            id: '2', 
            checkLevel: 'is_division',
            title: 'risk_by_division', 
            type: 'isms-risk-by-division', 
            reportType: 'riskRegister', 
            endurl: 'isms-risk-count-by-divisions', 
            riskItemId: 'division_ids', 
            riskTypeValue: 'division', 
            tabletiltle: 'division', 
            activityname: 'EXPORT_ISMS_RISK_COUNT_BY_DIVISIONS' 
        },
        { 
            id: '3', 
            checkLevel: 'is_section',
            title: 'risk_by_section', 
            type: 'isms-risk-by-section', 
            reportType: 'riskRegister', 
            endurl: 'isms-risk-count-by-sections', 
            riskItemId: 'section_ids', 
            riskTypeValue: 'section', 
            tabletiltle: 'section', 
            activityname: 'EXPORT_ISMS_RISK_COUNT_BY_SECTIONS' 
        },
        { 
            id: '4', 
            checkLevel: 'is_ms_type',
            title: 'risk_by_ms_type', 
            type: 'isms-risk-by-ms-type', 
            reportType: 'riskRegister', 
            endurl: 'isms-risk-count-by-ms-types', 
            riskItemId: 'ms_type_ids', 
            riskTypeValue: 'ms_types', 
            tabletiltle: 'ms_types', 
            activityname: 'EXPORT_ISMS_RISK_COUNT_BY_MS_TYPES' 
        },
        { 
            id: '5', 
            title: 'risk_by_type', 
            type: 'isms-risk-by-type', 
            reportType: 'riskRegister', 
            endurl: 'isms-risk-count-by-risk-types', 
            riskItemId: 'risk_type_ids', 
            riskTypeValue: 'risk_type', 
            tabletiltle: 'risk_types', 
            activityname: 'EXPORT_ISMS_RISK_COUNT_BY_RISK_TYPES' 
        },
        { 
            id: '6', 
            title: 'risk_by_category', 
            type: 'isms-risk-by-category', 
            reportType: 'riskRegister', 
            endurl: 'isms-risk-count-by-risk-categories', 
            riskItemId: 'risk_category_ids', 
            riskTypeValue: 'risk_category', 
            tabletiltle: 'risk_category', 
            activityname: 'EXPORT_ISMS_RISK_COUNT_BY_RISK_CATEGORIES' 
        },
        { 
            id: '7', 
            title: 'risk_by_owner', 
            type: 'isms-risk-by-owner', 
            reportType: 'riskRegister', 
            endurl: 'isms-risk-count-by-owners', 
            riskItemId: 'risk_owner_ids', 
            riskTypeValue: 'first_name',
            riskTypeValue2: 'last_name', 
            tabletiltle: 'risk_owner', 
            activityname: 'EXPORT_ISMS_RISK_COUNT_BY_OWNERS' 
        },
        { 
            id: '8', 
            title: 'risk_by_respossible_user', 
            type: 'isms-risk-by-responsible-user', 
            reportType: 'riskRegister', 
            endurl: 'isms-risk-count-by-responsible-users', 
            riskItemId: 'risk_responsible_user_ids', 
            riskTypeValue: 'first_name',
            riskTypeValue2: 'last_name', 
            tabletiltle: 'responsible_user', 
            activityname: 'EXPORT_ISMS_RISK_COUNT_BY_RESPONSIBLE_USERS'
        },
        { 
            id: '9', 
            title: 'risk_by_status', 
            type: 'isms-risk-by-status', 
            reportType: 'riskRegister', 
            endurl: 'isms-risk-count-by-statuses', 
            riskItemId: 'risk_status_ids', 
            riskTypeValue: 'risk_statuses', 
            tabletiltle: 'risk_status', 
            activityname: 'EXPORT_ISMS_RISK_COUNT_BY_STATUSES' 
        },
        { 
            id: '10', 
            title: 'risk_by_source', 
            type: 'isms-risk-by-source', 
            reportType: 'riskRegister', 
            endurl: 'isms-risk-count-by-sources', 
            riskItemId: 'risk_source_ids', 
            riskTypeValue: 'risk_sources', 
            tabletiltle: 'risk_source', 
            activityname: 'EXPORT_ISMS_RISK_COUNT_BY_SOURCES' 
        },
        { 
            id: '11', 
            title: 'risk_by_area', 
            type: 'isms-risk-by-areas', 
            reportType: 'riskRegister', 
            endurl: 'isms-risk-count-by-areas', 
            riskItemId: 'risk_area_ids', 
            riskTypeValue: 'risk_areas', 
            tabletiltle: 'risk_areas', 
            activityname: 'EXPORT_ISMS_RISK_COUNT_BY_AREAS' 
        },
        { 
            id: '12', 
            title: 'risk_by_inherent_risk_rating', 
            type: 'isms-risk-by-inherent-risk-rating', 
            reportType: 'riskRegister', 
            endurl: 'isms-risk-count-by-inherent-risk-ratings', 
            riskItemId: 'inherent_risk_rating_ids', 
            riskTypeValue: 'risk_ratings', 
            tabletiltle: 'inherent_risk_rating', 
            activityname: 'EXPORT_ISMS_RISK_COUNT_BY_INHERENT_RISK_RATINGS' 
        },
        { 
            id: '13', 
            title: 'risk_by_residual_risk_rating', 
            type: 'isms-risk-by-residual-risk-rating', 
            reportType: 'riskRegister', 
            endurl: 'isms-risk-count-by-residual-risk-ratings', 
            riskItemId: 'residual_risk_rating_ids', 
            riskTypeValue: 'risk_ratings', 
            tabletiltle: 'residual_risk_rating', 
            activityname: 'EXPORT_ISMS_RISK_COUNT_BY_RESIDUAL_RISK_RATINGS' 
        },
        { 
            id: '14', 
            analysisId: 'risk_score',
            title: 'risk_by_risk_score_inherent', 
            type: 'isms-risks-by-risk-score-inherent', 
            reportType: 'riskRegister', 
            endurl: 'isms-risk-count-by-inherent-scores', 
            riskItemId: 'inherent_risk_score', 
            riskTypeValue: 'risk_score', 
            tabletiltle: 'inherent_risk_score', 
            activityname: 'EXPORT_ISMS_RISK_COUNT_BY_INHERENT_SCORES' 
        },
        { 
            id: '15', 
            analysisId: 'risk_score',
            title: 'risk_by_risk_score_residual', 
            type: 'isms-risks-by-risk-score-residual', 
            reportType: 'riskRegister', 
            endurl: 'isms-risk-count-by-residual-scores', 
            riskItemId: 'residual_risk_score', 
            riskTypeValue: 'risk_score', 
            tabletiltle: 'residual_risk_score', 
            activityname: 'EXPORT_ISMS_RISK_COUNT_BY_RESIDUAL_SCORES' 
        },
        { 
            id: '16', 
            title: 'risk_by_risk_control_plan', 
            type: 'isms-risk-by-risk-control-plan', 
            reportType: 'riskRegister', 
            endurl: 'isms-risk-count-by-risk-control-plans', 
            riskItemId: 'risk_control_plan_ids', 
            riskTypeValue: 'control_plan', 
            tabletiltle: 'control_plan', 
            activityname: 'EXPORT_ISMS_RISK_COUNT_BY_RISK_CONTROL_PLANS' 
        },
        { 
            id: '17', 
            title: 'risk_treatment_by_status', 
            type: 'isms-risk-by-treatment-status', 
            reportType: 'riskTreatment', 
            endurl: 'isms-risk-treatment-count-by-statuses', 
            riskItemId: 'risk_treatment_status_ids', 
            riskTypeValue: 'risk_treatment_statuses', 
            tabletiltle: 'treatment_status', 
            activityname: 'EXPORT_ISMS_RISK_TREATMENT_COUNT_BY_STATUSES' 
        },
        { 
            id: '18', 
            title: 'risk_treatment_by_responssible_user', 
            type: 'isms-risk-by-treatment-responsible-user', 
            reportType: 'riskTreatment', 
            endurl: 'isms-risk-treatment-count-by-responsible-users', 
            riskItemId: 'risk_treatment_responsible_user_ids', 
            riskTypeValue: 'first_name',
            riskTypeValue2: 'last_name', 
            tabletiltle: 'treatment_responsible_user', 
            activityname: 'EXPORT_ISMS_RISK_TREATMENT_COUNT_BY_RESPONSIBLE_USERS' 
        },
        { 
            id: '19', 
            title: 'risk_by_products', 
            type: 'isms-risk-by-products', 
            reportType: 'riskRegister', 
            endurl: 'isms-risk-count-by-products', 
            riskItemId: 'product_ids', 
            riskTypeValue: 'product',
            tabletiltle: 'product', 
            activityname: 'EXPORT_ISMS_RISK_COUNT_BY_PRODUCTS' 
        }
    ];
    @observable
    private _reportsList: Reports[] = [];

    @observable
    private _ismsCountDetails: ReportDetails[] = [];

    @observable
    reportloaded: boolean = false;

    @observable
    listloaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'reference_code';

    @observable
    individual_isms_loaded: boolean = false;

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
    setReportDetails(response: any) {
        this._reportsList = response;
        this.reportloaded = true;
    }

    @action
    setRiskCountDetails(response: ReportDetailsPaginationResponse) {
        this._ismsCountDetails = response.data;
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
        this._ismsCountDetails = [];
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
    get IsmsItemsDetails(): ReportDetails[] {

        return this._ismsCountDetails.slice();
    }

    @computed
    get ReportListArray(): ReportList[] {

        return this.reportLists;
    }


}

export const IsmsReportStore = new Store();




