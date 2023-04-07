import { action, computed, observable } from "mobx-angular";
import { Image } from "src/app/core/models/image.model";
import { ReportTemplates, ReportTemplatesResponse } from "src/app/core/models/mrm/meeting-report-templates/meeting-report-templates";

class Store {

    @observable
    _reportTemplates: ReportTemplates[] = [];

    @observable
    _reportTemplatesDetails:ReportTemplates;

    @observable 
    loaded:boolean=false;

    @observable
    individualLoaded: boolean = false;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    totalItems: number = null;

    @observable
    itemsPerPage: number = null;

    @observable
    currentPage: number = 1;
    
    @observable
    searchText: string;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = '';

    @observable
    editFlag: boolean = true;

    @observable
    reportTemeplateId:number;

    @observable
    private _documentDetails: Image[] = [];

    @observable
    preview_url: string;
    

    @action
    setDocumentDetails(details: Image,url: string) {
        
        this._documentDetails.push(details);
        this.preview_url = url; 
    }

    @action
    unsetDocumentDetails() {
        
        this._documentDetails=[];
        this.preview_url = null ;
    }

    @action
    romveDocumentDetails(token?:string){
        
        var b_pos = this._documentDetails.findIndex(e => e.token == token)
        if(b_pos != -1){
            if(this._documentDetails[b_pos].hasOwnProperty('is_new')){
                this._documentDetails.splice(b_pos,1);
            }
            else{
                this._documentDetails[b_pos]['is_deleted'] = true;
            }
        }
    }

    @computed
    get docDetails(): Image[] {
        return this._documentDetails.slice();
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setMeetingReportTemplates(response: ReportTemplatesResponse) {
        
        this._reportTemplates = response.data;  
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unsetMeetingReportTemplatesList() {
        this._reportTemplates = [];  
        this.currentPage = null;
        this.itemsPerPage = null;
        this.totalItems = null;
        this.from = null;
        this.loaded = false;
    }

    @computed
    get allItems(): ReportTemplates[] {
        
        return this._reportTemplates.slice();
    }

    @action
    setMeetingReportTemplatesDetails(data: ReportTemplates) {
        this._reportTemplatesDetails = data;
        this.individualLoaded = true;
    }

    @action
    unSetMeetingReportTemplatesDetails(){
        this._reportTemplatesDetails = null;
        this.individualLoaded = false;
        this._documentDetails=[];
        this.preview_url = null ;
    }

    @action
    getMeetingReportTemplatesById(id: number): ReportTemplates {
        return this._reportTemplates.slice().find(e => e.id == id);
    }

    @computed
    get individualMeetingReportTemplatesDetails(): ReportTemplates {
        return this._reportTemplatesDetails;
    }

}

export const MeetingReportTemeplates = new Store();