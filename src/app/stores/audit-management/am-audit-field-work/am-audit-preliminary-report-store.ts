import { observable, action, computed } from "mobx-angular";
import { AmAuditFieldWork, AmAuditFieldWorkPaginationResponse } from "src/app/core/models/audit-management/am-audit-field-work/am-audit-field-work";
import { AmPreliminaryReport } from "src/app/core/models/audit-management/am-audit-field-work/am-audit-preliminary-reports";

class Store {
    @observable
    private _preliminaryReport:AmPreliminaryReport;

    @observable
    loaded: boolean = false;

    @observable
    private _individualReportDetails: AmPreliminaryReport;

    @observable
    individual_report_loaded: boolean = false;

    @action
    setReports(response) {
        this._preliminaryReport = response;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }


    @computed
    get reportDetails(){

        return this._preliminaryReport;
    }


    @action
    setIndividualReportDetails(details:AmPreliminaryReport) {
        this.individual_report_loaded = true;
        this._individualReportDetails = details;
        // this.updateAuditFieldWork(details);
    }

    unsetIndiviudalAuditFieldWorkDetails() {
        this._individualReportDetails = null;
        this.individual_report_loaded = false;
    }

 
   
    @computed
    get individualReportDetails(): AmPreliminaryReport {
        return this._individualReportDetails;
    }

    




}

export const AmPreliminaryReportStore = new Store();