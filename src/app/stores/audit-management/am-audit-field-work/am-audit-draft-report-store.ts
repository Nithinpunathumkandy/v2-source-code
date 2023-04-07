import { observable, action, computed } from "mobx-angular";
import { AmAuditFieldWork, AmAuditFieldWorkPaginationResponse } from "src/app/core/models/audit-management/am-audit-field-work/am-audit-field-work";
import { AmDraftReport } from "src/app/core/models/audit-management/am-audit-field-work/am-audit-draft-reports";

class Store {
    @observable
    private _draftReport:AmDraftReport;

    @observable
    loaded: boolean = false;

    @observable
    private _individualReportDetails: AmDraftReport;

    @observable
    individual_report_loaded: boolean = false;

 
    @action
    setReports(response) {
        this._draftReport = response;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }


    @computed
    get reportDetails(){

        return this._draftReport;
    }


    @action
    setIndividualReportDetails(details:AmDraftReport) {
        this.individual_report_loaded = true;
        this._individualReportDetails = details;
        // this.updateAuditFieldWork(details);
    }

    unsetIndiviudalAuditFieldWorkDetails() {
        this._individualReportDetails = null;
        this.individual_report_loaded = false;
    }

 
   
    @computed
    get individualReportDetails(): AmDraftReport {
        return this._individualReportDetails;
    }

    




}

export const AmDraftReportStore = new Store();