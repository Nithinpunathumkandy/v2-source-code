import { action, computed, observable } from 'mobx';
import { ExecutiveReportList, ExecutiveReportsPaginationResponse, IndividualExecutiveDetail } from 'src/app/core/models/risk-management/reports/executive-summary-report';

class Store{
    @observable
    private _executiveReportList: ExecutiveReportList[] = [];

    @observable
    private _executiveIndividulaDetails: IndividualExecutiveDetail;

    @observable
    loaded: boolean = false;

    @observable
    executive_details_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    orderItem: string = 'executive_summary_title.reference_code';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    searchText: string;

    @observable
    id: number = null;

    @computed
    get executiveDetailReportList(): ExecutiveReportList[] {
        return this._executiveReportList.slice();
    }

    @computed
    get executiveDetailsReports(): IndividualExecutiveDetail {
    return this._executiveIndividulaDetails;
    }

    @action
    setAllExecutiveSummaryReport(ErmDetailReport: ExecutiveReportList[]) {
        this._executiveReportList = ErmDetailReport;
        this.loaded = true;
    }

    getExecuteSummaryById(id: number): ExecutiveReportList {
        return this._executiveReportList.slice().find(e => e.id == id);
    }

    getExecutiveSymmaryDetailedById(id: number) {
        return this._executiveIndividulaDetails.executive_summary_report_details.slice().find(e => e.id == id);
    }

    @action
    setIndividulaExecutiveSummaryReport(details) {
        this.executive_details_loaded = true;
        this._executiveIndividulaDetails=details;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setExecutiveSummaryReport(response: ExecutiveReportsPaginationResponse){
        this._executiveReportList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    unsetExcecutiveSummaryDetails(){
        this.executive_details_loaded = false;
        this._executiveIndividulaDetails = null;
    }

}

export const ExecutiveReportStore = new Store();