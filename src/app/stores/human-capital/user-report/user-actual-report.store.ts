import { observable, action, computed } from "mobx-angular";
import { Report,ReportPaginationResponse } from 'src/app/core/models/human-capital/user-report/user-actual-report';
import { Image } from "src/app/core/models/image.model";

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
    user_id = null;

    @observable
    selectedReport = null;


    @observable
    currentIndex = 0;

    @observable
    frequencyIndex = 0;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    private _documentDetails: Image[] = [];

    @observable
    preview_url: string;

    @observable
    view_more: boolean = false;


    @action
    setUserReportDetails(response: ReportPaginationResponse) {
        this._reportList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }

    @computed
    get reportDetails() {
        if(this._reportList?.length>0){
            return this._reportList.slice();
        }

        
    }

    @action
    setIndividualReportDetails(details, reportId?) {
        this.individual_report_loaded = true;
        this._individualReportDetails = details;
        // if (reportId) {
        //      for (let i = 0; i < this._reportList.length; i++) {
        //          for(let j=0; j<this._reportList[i].reports.length;j++){
        //             if (this._reportList[i].reports[j].id == reportId) {
        //             //    this._individualReportDetails=this._reportList[i];
        //             this.frequency_id=this._reportList[i].report_frequency_id;
        //                this.frequencyIndex=i;
        //                 this.currentIndex = j;
                        
        //             }
        //          }
                
        //      }
        // }

    }

    unsetIndiviudalReportDetails() {
        this._individualReportDetails = null;
        this.individual_report_loaded = false;
    }

    unsetReportDetails() {
        this._reportList = null;
        this.loaded = false;
    }


    @computed
    get individualReportDetails() {
        this.individual_report_loaded = true;
        return this._individualReportDetails;
       
    }

    @computed
    get reportList(){
        return this._reportList;
    }

    @computed
    get docDetails(): Image[] {
        return this._documentDetails.slice();
    }

    @action
    setDocumentDetails(details: Image, url: string) {
        
            this._documentDetails.push(details);
            this.preview_url = url;
        
    }

    @action
    unsetDocumentDetails(token?:string){
        
            var b_pos = this._documentDetails.findIndex(e => e.token == token)
            if(b_pos != -1){
                if(this._documentDetails[b_pos].hasOwnProperty('is_new')){
                    this._documentDetails.splice(b_pos,1);
                }
                else{
                    this._documentDetails[b_pos]['is_deleted'] = true;
                }
            }
            //this._brocureDetails = null;
            //this.brochure_preview_url = null;
        
    }

    @action
    clearDocumentDetails() {
        this._documentDetails = [];
        this.preview_url = null;
    }

}

export const UserActualReportStore = new Store();