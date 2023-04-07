import { action, computed, observable } from 'mobx';
import { ErmReportList, ErmDetailsReportsPaginationResponse, IndividualErmDetail, ErmDetailedrisk } from 'src/app/core/models/risk-management/reports/ermDetailreport';

class Store{
    @observable
    private _ermReportList: ErmReportList[] = [];

    @observable
    private _ermImdividulaDetails: IndividualErmDetail;

    @observable
    loaded: boolean = false;

    @observable
    erm_details_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    orderItem: string = 'erm_detail_title.reference_code';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    searchText: string;

    @observable
    id: number = null;
    
    @computed
    get ermDetailReportList(): ErmReportList[] {
        return this._ermReportList.slice();
    }

    @computed
    get ermDetailsReports(): IndividualErmDetail {
    return this._ermImdividulaDetails;
    }

    @action
    setAllErmDetailReport(ErmDetailReport: ErmReportList[]) {
        this._ermReportList = ErmDetailReport;
        this.loaded = true;
    }

    getIndidualDetailRiskById(id: number) {
        return this._ermImdividulaDetails.detailed_erm_report_risks.slice().find(e => e.id == id);
    }

    getIndidualDetailRiskTreatmentById(id: number, pos: number) {
        return this._ermImdividulaDetails.detailed_erm_report_risks[pos].detailed_erm_report_risk_treatments.slice().find(e => e.id == id);
    }

    @action
    setIndividulaErmDetailReport(details) {
        this.erm_details_loaded = true;
        this._ermImdividulaDetails=details;
    }

    @action
    unsetIndividulaErmDetailReport() {
        this.erm_details_loaded = false;
        this._ermImdividulaDetails= null;;
    }


    getErmDetailById(id: number) {
        return this._ermReportList.slice().find(e => e.id == id);
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setErmDetailReport(response: ErmDetailsReportsPaginationResponse){
        this._ermReportList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    unsetERMDetails(){
        this._ermImdividulaDetails = null;
    }
}

export const ErmDetailsStore = new Store();