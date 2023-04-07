
import { Image } from "src/app/core/models/image.model";
import { observable, action, computed } from "mobx-angular";
import { History, HistoryData, IncidentCorrectiveAction, IncidentCorrectiveActionPaginationResponse } from "src/app/core/models/incident-management/incident/corrective-action/incident-corrective-action";



class Store {
    @observable
    private _incidentCorrectiveAction: IncidentCorrectiveAction[] = [];

    @observable
    private _responsibleUser: IncidentCorrectiveAction[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    hideSubMenu: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'incident_corrective_actions.created_at';

    @observable
    individualLoaded: boolean = false;

    // @observable
    // individualIncidentItem: Incident;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;
    @observable
    private _imageDetails: Image = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;

    @observable
    preview_url: string;

    @observable
    document_preview_available: boolean = false;

    @observable
    private _documentDetails: Image[] = [];

    @observable
    initialId: any;
    
    @observable
    private _documentDetailsUpdate: Image[] = [];

    @observable
    individualCAItem: IncidentCorrectiveAction;

    // @observable
    // selected_incident_loaded = false;

    // @observable
    // selectedIincident: Incident;

    @observable
    selectedNeedsExpectations: any[] = [];

    @observable
    correctiveActionDetailList :IncidentCorrectiveAction

    @observable
    correctiveActionDetailListLoaded:  boolean = false;

    @observable
    individualIncidentCorrectiveAction: IncidentCorrectiveAction;

    @observable
    selectedIncidentId: number;
    new_ca_id: number = null;
    selected: number = null;


    @observable
    historyCurrentPage: number = 1;

    @observable
    historyItemsPerPage: number = null;

    @observable
    historyTotalItems: number = null;

    @observable
    treatmentUpdateDataLoaded: boolean = false;


    @observable
    searchText: string;

    @observable
    private _treatmentUpdateData: History[];


    @action
    clearDocumentDetails() {
        this._documentDetails = [];
        this.preview_url = null;
    }
   
    @action
    setDocumentDetails(details: Image,url: string) {
        
            this._documentDetails.push(details);
            this.preview_url = url;
        
    }

    @action
    setSelected(value:number){
        this.selected = value;
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
    setDocumentImageDetails(details, url: string, type: string){
        if(type == 'logo'){
            this._imageDetails = details;
            this.preview_url = url;
        }
        else{
            this._documentDetailsUpdate.push(details);
            this.preview_url = url;
        }
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
            var b_pos = this._documentDetailsUpdate.findIndex(e => e.token == token)
            if(b_pos != -1){
                if(this._documentDetailsUpdate[b_pos].hasOwnProperty('is_new')){
                    this._documentDetailsUpdate.splice(b_pos,1);
                }
                else{
                    this._documentDetailsUpdate[b_pos]['is_deleted'] = true;
                }
            }
            //this._brocureDetails = null;
            //this.brochure_preview_url = null;
        }

       
    }

    @action
    clearDocumentDetailsUpdate() {
        this._documentDetailsUpdate = [];
        this.preview_url = null;
    }

    @computed
    get getDocumentDetails(): Image[]{
        return this._documentDetailsUpdate.slice();
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
    setIncidentCorrectiveAction(response: IncidentCorrectiveActionPaginationResponse) {
        

        this._incidentCorrectiveAction = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    // @action
    // setIndividualCADetails(IncidentCorrectiveAction: IncidentCorrectiveAction) {
       
    //     this.individualCAItem = IncidentCorrectiveAction;
    //     this.individualLoaded = true;
        
    // }

    @action
    setAllIncidentCorrectiveAction(incidentCorrectiveAction: IncidentCorrectiveAction[]) {
       
        this._incidentCorrectiveAction = incidentCorrectiveAction;
        this.loaded = true;
        
    }

    @action
    setIndividualIncidentCAItem(incidentCorrectiveAction: IncidentCorrectiveAction) {
       
        this.individualCAItem = incidentCorrectiveAction;
        this.individualLoaded = true;
        
    }

    @action
    unsetSelectedItemDetails(){
        this.individualLoaded = false;
        this.individualCAItem = null;
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
    setSelectedIincidentId(id: number){
        this.selectedIncidentId = id;
    }

    
    @computed
    get historyData():History[]{
        return this._treatmentUpdateData.slice();
    }

    // @action
    // unsetIssueDetails(){
    //     this.selected_incident_loaded = false;
    //     this.selectedIincident = null;
    //     this.selectedNeedsExpectations = [];
    // }

    @action
    setSubMenuHide(value:boolean){
        this.hideSubMenu = value
    }

    @action
    unSetIncidentCorrectiveAction(){
        this._incidentCorrectiveAction = [];
        this.loaded = false;
    }

    get selectedItem():number{
        return this.selected;
    }

    @computed
    get initialItemId():number{
        return this._incidentCorrectiveAction[0].id
    }

    @computed
    get tabHides(){
        return this.hideSubMenu;
    }

    
    @computed
    get allItems(): IncidentCorrectiveAction[] {
        
        return this._incidentCorrectiveAction.slice();
    }

    @computed
    get docDetails(): Image[] {
        return this._documentDetails.slice();
    }

   

    @computed
    get selectedId(): number{
        return this.selectedIncidentId;
    }
   

    @action
    getIncidentCorrectiveActionById(id: number): IncidentCorrectiveAction {
        return this._incidentCorrectiveAction.slice().find(e => e.id == id);
    }
    @computed
    get correctiveActionDetails(){
        return this.individualCAItem;
    } 

    get IncidentCAList(): IncidentCorrectiveAction{
        return this.correctiveActionDetailList
    }

    @action
    setSelectedIncidentId(id: number){
        this.selectedIncidentId = id;
    }

    @action
    setIncidentCA(items : IncidentCorrectiveAction){
        this.correctiveActionDetailList = items
        this.correctiveActionDetailListLoaded = true;
    }

    
    @action
    setHistoryCurrentPage(current_page: number) {
        this.historyCurrentPage = current_page;
    }

    @action
    unsetIndividualCorrectiveAction(){
        this.correctiveActionDetailList = null;
        this.correctiveActionDetailListLoaded = false;
    }
  
}


export const IncidentCorrectiveActionStore = new Store();

