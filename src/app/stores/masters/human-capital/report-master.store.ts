import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { Report,Frequency,ReportPaginationResponse } from 'src/app/core/models/masters/human-capital/user-report';
import { Image } from "src/app/core/models/image.model";

class Store {
    // @observable
    // private _frequencies: Frequency[]=[];

    @observable
    private _reports: Report[]=[];

    @observable
    loaded: boolean = false;

    // @observable
    // frequency_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    document_preview_available: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'user_reports.created_at';

    @observable
    from: number = null;

    @observable
    preview_url: string;

    @observable
    private _documentDetails: Image[] = [];

    @observable
    private _individualReportDetails: Report;

    @observable
    individual_report_loaded: boolean = false;

    searchText: string;

    @observable
    lastInsertedId: number = null;

    // @action
    // setFrequencies(response: Frequency[]) {
    //     this._frequencies = response;
        
    //     this.frequency_loaded = true;
    // }

    
    // @computed
    // get frequencies(): Frequency[] {

    //     return this._frequencies.slice();
    // }

    @computed
    get docDetails(): Image[] {
        return this._documentDetails.slice();
    }


    @action
    setReports(response: ReportPaginationResponse) {
        this._reports = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    
    @computed
    get reports(): Report[] {

        return this._reports.slice();
    }

    @action
    setDocumentDetails(details: Image, url: string) {
        
            this._documentDetails.push(details);
            this.preview_url = url;
        
    }

    getReportById(id: number): Report{
        return this._reports.slice().find(e=>e.id == id);
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

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setIndividualReportDetails(details) {
        this.individual_report_loaded = true;
        this._individualReportDetails = details;

    }

    unsetIndiviudalJobDetails() {
        this._individualReportDetails = null;
        this.individual_report_loaded = false;
    }

    @computed
    get individualReportDetails(): Report {
        return this._individualReportDetails;
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }





    
}

export const ReportMasterStore = new Store();