import { action, computed, observable } from 'mobx';
import { ProfileReport, ReportArray } from 'src/app/core/models/my-profile/profile/profile-report';

class Store{
    @observable
    private _profileReport:ProfileReport[] = [];

    @observable
    private _profileReportFrequency;

    @observable
    private _profileReportDetails :ReportArray;

    @observable
    loaded:boolean =false;

    @observable
    individual_report_loaded:boolean =false;

    // @observable
    // currentPage: number = 1;

    // @observable
    // itemsPerPage: number = null;

    // @observable
    // totalItems: number = null;

    // @observable
    // from: number = null;

    @computed
    get profileReport(): ProfileReport[] {
       return this._profileReport;
    }

    @computed
    get profileReportDetail(): ReportArray {
       return this._profileReportDetails;
    }

    @action
    setProfileReport(response ){
        this._profileReport = response;
        this.loaded = true;
    }

    @action
    setReportDetails(details:ReportArray) {
        this.individual_report_loaded = true
        this._profileReportDetails=details;
    }

    unsetReportDetails(){
        this.individual_report_loaded = false;
        this._profileReportDetails = null;
    }
}

export const ProfileReportStore = new Store();