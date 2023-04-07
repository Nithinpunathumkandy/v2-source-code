import { Image } from "src/app/core/models/image.model";
import { observable, action, computed } from "mobx-angular";
import { IncidentTemplates } from "src/app/core/models/incident-management/incident-template/incidet-template";


class Store {
    @observable
    private _templates : []   = [] 

    searchText: string;
    
    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable 
    loaded:boolean=false;

    @observable
    private singleIncidentTemplate: IncidentTemplates;

    @observable 
    individualLoaded:boolean=false;
    
    @observable
    reportTemeplateId:number;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    private _imageDetails: Image = null;

    @observable
    preview_url: string;
    @observable
    private _documentDetails: Image[] = [];
    @observable
    private _conclusionDocumentDetails: Image[] = [];

    @action
    setDocumentDetails(details: Image,url: string) {
        
            this._documentDetails.push(details);
            this.preview_url = url; 
    }

    @action
    setConclusionDocumentDetails(details: Image,url: string) {
        
            this._conclusionDocumentDetails.push(details);
            this.preview_url = url; 
    }

    @action
    unsetDocumentDetails() {
        
            this._documentDetails=[];
            this.preview_url = null ;
    }
    @action
    unsetConclusionDocumentDetails() {
        
            this._conclusionDocumentDetails=[];
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

    @action
    romvConclusioneDocumentDetails(token?:string){
        
        var b_pos = this._conclusionDocumentDetails.findIndex(e => e.token == token)
        if(b_pos != -1){
            if(this._conclusionDocumentDetails[b_pos].hasOwnProperty('is_new')){
                this._conclusionDocumentDetails.splice(b_pos,1);
            }
            else{
                this._conclusionDocumentDetails[b_pos]['is_deleted'] = true;
            }
        }
    }

    @computed
    get docDetails(): Image[] {
        return this._documentDetails.slice();
    }

    @computed
    get docConclusionDetails(): Image[] {
        return this._conclusionDocumentDetails.slice();
    }
    @action
    setInvestigations(response ) {
        
        this._templates = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    // @action
    // setDocumentDetails(details: Image,url: string,type: string) {
    //     if(type == 'logo'){
    //         this._imageDetails = details;
    //         this.preview_url = url;
    //     }
    //     else{
    //         this._documentDetails.push(details);
    //         this.preview_url = url;
    //     } 
    // }

 
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setIndividualIncidentTemplate(res){
        this.singleIncidentTemplate = res;
        this.individualLoaded = true;
    }

    @computed
    get IncidentTemplateDetails(): IncidentTemplates {
        
        return this.singleIncidentTemplate
    }

    unsetTemplateDetails(){
        this.singleIncidentTemplate = null;
        this.individualLoaded = false;
    }

    
    @computed
    get allItems() {
        
        return this._templates.slice();
    }


 


}

export const IncidentTemplateStore = new Store();
