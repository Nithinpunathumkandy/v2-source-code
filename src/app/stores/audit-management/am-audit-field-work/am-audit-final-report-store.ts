import { observable, action, computed } from "mobx-angular";
import { AmAuditFieldWork, AmAuditFieldWorkPaginationResponse } from "src/app/core/models/audit-management/am-audit-field-work/am-audit-field-work";
import { AmFinalReport } from "src/app/core/models/audit-management/am-audit-field-work/am-audit-final-reports";

class Store {
    @observable
    private _finalReport:AmFinalReport;

    @observable
    loaded: boolean = false;

    @observable
    private _individualReportDetails: AmFinalReport;

    @observable
    individual_report_loaded: boolean = false;

    @action
    setReports(response) {
        this._finalReport = response;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }


    @computed
    get reportDetails(){

        return this._finalReport;
    }


    @action
    setIndividualReportDetails(details:AmFinalReport) {
        this.individual_report_loaded = true;
        this._individualReportDetails = details;
        // this.updateAuditFieldWork(details);
    }

    unsetIndiviudalAuditFieldWorkDetails() {
        this._individualReportDetails = null;
        this.individual_report_loaded = false;
    }

 
   
    @computed
    get individualReportDetails(): AmFinalReport {
        return this._individualReportDetails;
    }

    




}

export const AmFinalReportStore = new Store();