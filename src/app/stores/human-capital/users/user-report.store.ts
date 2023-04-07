import { observable, action, computed } from "mobx-angular";
import { Report } from 'src/app/core/models/human-capital/users/user-report';

class Store {
    @observable
    private _reportList: Report[] = [];


    @observable
    loaded: boolean = false;

    @observable
    private _individualReportDetails: Report;

    @observable
    individual_report_loaded: boolean = false;

    @observable
    frequency_id = null;

    @observable
    currentIndex = 0;

    @observable
    frequencyIndex = 0;



    @action
    setReports(response: Report[]) {
        this._reportList = response;
        this.loaded = true;

    }

    @computed
    get reportDetails(): Report[] {

        return this._reportList.slice();
    }

    unsetReportDetails(){
        this._reportList=[];
    }

    @action
    setIndividualReportDetails(details, reportId?) {
        this.individual_report_loaded = true;
        this._individualReportDetails = details;
        if (reportId) {
             for (let i = 0; i < this._reportList.length; i++) {
                 for(let j=0; j<this._reportList[i].reports.length;j++){
                    if (this._reportList[i].reports[j].id == reportId) {
                    //    this._individualReportDetails=this._reportList[i];
                    this.frequency_id=this._reportList[i].report_frequency_id;
                       this.frequencyIndex=i;
                        this.currentIndex = j;
                        
                    }
                 }
                
             }
        }

    }

    unsetIndiviudalJobDetails() {
        this._individualReportDetails = null;
        this.individual_report_loaded = false;
    }


    @computed
    get individualReportDetails() {
        this.individual_report_loaded = true;
        for (let i of UserReportStore.reportDetails) {

            if (i.report_frequency_id == this.frequency_id) {
                return i;
            }

        }
        // return this._individualReportDetails;
    }


}

export const UserReportStore = new Store();