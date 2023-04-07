import { action, computed, observable } from 'mobx';
import { IndividualQuickRiskDetail, QuickRiskReportList, QuickRiskReportsPaginationResponse } from 'src/app/core/models/risk-management/reports/quick-risk-assesment-report';

class Store{
    @observable
    private _quickRiskAssessmentLIst: QuickRiskReportList[] = [];

    @observable
    private _quickRiskAssessmentIndividualDetail: IndividualQuickRiskDetail;

    @observable
    loaded: boolean = false;

    @observable
    quick_risk_details_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    orderItem: string = 'quick_risk_title.reference_code';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    searchText: string;

    @observable
    id: number = null;

    @observable
    reportId: number = null;

    @computed
    get quickAssessmentDetailReportList(): QuickRiskReportList[] {
        return this._quickRiskAssessmentLIst.slice();
    }

    @computed
    get quickAssessmentDetailsReports(): IndividualQuickRiskDetail {
    return this._quickRiskAssessmentIndividualDetail;
    }

    @action
    setAllQuickAssessmentReport(quickRiskReport: QuickRiskReportList[]) {
        this._quickRiskAssessmentLIst = quickRiskReport;
        this.loaded = true;
    }

    getQuickRiskById(id: number): QuickRiskReportList {
        return this._quickRiskAssessmentLIst.slice().find(e => e.id == id);
    }

    getQuickRiskDetailedById(id: number) {
        return this._quickRiskAssessmentIndividualDetail.quick_risk_assessment_report_details.slice().find(e => e.id == id);
    }

    getQuickRiskSummaryById(id: number) {
        return this._quickRiskAssessmentIndividualDetail.quick_risk_assessment_report_risks.slice().find(e => e.id == id);
    }

    @action
    setIndividualQuickAssessmentReport(details) {
        this.quick_risk_details_loaded = true;
        this._quickRiskAssessmentIndividualDetail=details;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setQuickRiskReport(response: QuickRiskReportsPaginationResponse){
        this._quickRiskAssessmentLIst = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    unsetQuickRiskReportDetails(){
        this.quick_risk_details_loaded = false;
        this._quickRiskAssessmentIndividualDetail = null;
    }

}

export const QuickRiskAssessmentReportStore = new Store();