import { observable, action, computed } from "mobx-angular";
import { Image } from "src/app/core/models/image.model";
import {RiskTreatment,RiskTreatmentPaginationResponse,IndividualRiskTreatment, RiskSummary, HistoryData, History} from 'src/app/core/models/risk-management/risks/risk-treatment';

class Store {

    @observable
    private _riskTreatmentDetails: IndividualRiskTreatment = null;

    
    @observable
    private _treatmentUpdateData: History[];

    @observable
    private _riskTreatmentList: RiskTreatment[] = [];

    @observable
    private _summaryDetails:RiskSummary = null;

    @observable
    private _riskProcessDetails: RiskTreatment = null;

    @observable
    private _imageDetails: Image = null;

    @observable
    preview_url: string;

    @observable
    treatment_id: number = null;

    @observable
    private _documentDetails: Image[] = [];

    @observable
    loaded: boolean = false;

    @observable
    isRiskTreatmentPlan: boolean = false;

    @observable
    processIndex:number = null;

    @observable
    selectedRiskControls =[];

    
    @observable
    individualTreatmentLoaded: boolean = false;

    @observable
    selected_preview_url: string;
    
    
    @observable
    treatmentUpdateDataLoaded: boolean = false;

    
    @observable
    document_preview_available = false;

    
    @observable
    processLoaded: boolean = false;

    @observable
    summaryLoaded: boolean = false;

    @observable
    editFlag: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    historyCurrentPage: number = 1;

    @observable
    historyItemsPerPage: number = null;

    @observable
    historyTotalItems: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'reference_code';

    @observable
    searchText: string;


    @action
    setTreatmentDetails(response: RiskTreatmentPaginationResponse) {
        this._riskTreatmentList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }

    @action
    unsetTreatmentDetails() {
        this._riskTreatmentList = [];
        this.loaded = false;
    }

    @action
    unsetIndividualTreatmentDetails() {
        this._riskTreatmentDetails = null;
        this.individualTreatmentLoaded = false;
    }

    @action
    unsetHistoryDetails() {
        this._treatmentUpdateData = [];
        this.treatmentUpdateDataLoaded = false;
    }

    @action
    riskTreatmentById(id: number){
        let treatment = this._riskTreatmentList.findIndex(e=>e.id == id);
        return treatment;
    }
    

    @action
    setIndividualRiskTreatment(response: IndividualRiskTreatment) {
        this._riskTreatmentDetails = response;
        this.individualTreatmentLoaded = true;
        //this.updateUserJob(response.data);
    }

    
    @action
    setTreatmentUpdateData(response: HistoryData) {
        this._treatmentUpdateData = response.data;
        this.historyCurrentPage = response.current_page;
        this.historyItemsPerPage = response.per_page;
        this.historyTotalItems = response.total;
        this.treatmentUpdateDataLoaded = true;
        //this.updateUserJob(response.data);
    }

    getUserDocumentById(id: number): History {
        let documentList;
       
        documentList= this._treatmentUpdateData.slice().find(e => e.id == id);
        // RiskTreatmentStore.setIndividualDocumentDetails(documentList);
        return documentList;
    }

    
    @action
    setSummaryDetails(response: RiskSummary) {
        this._summaryDetails = response;
        this.summaryLoaded = true;
        //this.updateUserJob(response.data);
    }

    
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setHistoryCurrentPage(current_page: number) {
        this.historyCurrentPage = current_page;
    }

    @computed
    get historyData():History[]{
        return this._treatmentUpdateData.slice();
    }


    @computed
    get riskTreatmentList(): RiskTreatment[] {

        return this._riskTreatmentList.slice();
    }

    @computed
    get riskTreatmentDetails(): IndividualRiskTreatment {

        return this._riskTreatmentDetails;
    }


    
    
    @action
    setEditFlag() {
        this.editFlag = true;
    }

    @action
    unsetEditFlag() {
        this.editFlag = false;
    }

    @action
    unsetProductImageDetails(type: string,token?:string){
        if(type == 'logo'){
            if(this._imageDetails.hasOwnProperty('is_new')){
                this._imageDetails = null;
                this.preview_url = null;
            }
            else{
                this._imageDetails['is_deleted'] = true;
                this.preview_url = null;
            }
        }
        else{
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

       
    }

    @action
    setDocumentImageDetails(details:Image, url: string, type: string){
        if(type == 'logo'){
            this._imageDetails = details;
            this.preview_url = url;
        }
        else{
            this._documentDetails.push(details);
            this.preview_url = url;
        }
    }

    @action
    setSelectedImageDetails(imageDetails){
        
            this.selected_preview_url = imageDetails;
    }

    getSelectedImageDetails():string {
       
        return this.selected_preview_url;
}

    
    @computed
    get getDocumentDetails(): Image[]{
        return this._documentDetails.slice();
    }

    @computed
    get summaryDetails(){
        return this._summaryDetails;
    }


    @action
    clearDocumentDetails(){
        this._documentDetails = [];
        this.preview_url = null;
    }

    @action
    unsetTreatmentList(){
        this._riskTreatmentList = [];
        this.loaded = false;
    }


}

export const RiskTreatmentStore = new Store();