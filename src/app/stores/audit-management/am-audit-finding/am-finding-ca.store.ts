import { observable, action, computed } from "mobx-angular";

import { caHistoryData, caHistoryPaginationData, CorrectiveAction, CorrectiveActionPaginationResponse  } from 'src/app/core/models/internal-audit/audit-findings/corrective-action/corrective-action';
import { Image } from "src/app/core/models/image.model";
class Store {

    @observable
    private _correctiveActions: CorrectiveAction[] = [];

    @observable 
    loaded:boolean=false;
    
    @observable
    selected: number = null;

    @observable
    new_ca_id: number = null;

    @observable
    individualLoaded: boolean = false;

    @observable
    individualCAItem: CorrectiveAction;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;


    @observable
    totalItems: number = null;

    @observable
    CorrectiveActionHistoryItem: caHistoryData[] = [];

    @observable
    historyCurrentPage: number = 1;

    @observable
    historyLoaded: boolean = false;

    @observable
    historyItemsPerPage: number = null;

    @observable
    historyTotalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    preview_url: string;

    @observable
    document_preview_available: boolean = false;

    @observable
    private _documentDetails: Image[] = [];

    @observable
    orderItem: string = 'am_finding_corrective_actions.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    private _updateDocumentDetails: Image[] = [];

    @observable
    selected_preview_url: string;

    @observable
    private _imageDetails: Image = null;

    @observable
    update_document_preview_available = false;

    @observable
    hideSubMenu: boolean = false;

    @observable
    auditFindingId: number = null;

    @observable
    auditFindingCaId: number = null;

    searchText: string;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
   

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
    setSubMenuHide(value: boolean) {
        this.hideSubMenu = value
    }

    @computed
    get tabHides() {
        return this.hideSubMenu;
    }
    
    @action
    setAllCorrectiveActions(response: CorrectiveActionPaginationResponse) {
       
        this._correctiveActions = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
        
    }


    @action
    setFindingCorrectiveActions(CorrectiveAction: CorrectiveAction[]) {
       
        this._correctiveActions = CorrectiveAction;
        this.loaded = true;
        
    }

    @action
    unsetCorrectiveActions() {   
        this._correctiveActions = [];
        this.loaded = false;     
    }

    @action
    setSelected(value:number){
        this.selected = value;
    }

    @action
    unsetSelectedItemDetails(){
        this.individualLoaded = false;
        this.individualCAItem = null;
    }

    @action
    setIndividualCADetails(CorrectiveAction: CorrectiveAction) {
        this.individualCAItem = CorrectiveAction;
        this.individualLoaded = true;   
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }


    @computed
    get allItems(): CorrectiveAction[] {
        
        return this._correctiveActions;
    }

    @computed
    get initialItemId():number{
        return this._correctiveActions[0].id
    }

    @computed
    get docDetails(): Image[] {
        return this._documentDetails;
    }

    get selectedItem():number{
        return this.selected;
    }
    

    @action
    getCorrectiveActionById(id: number): CorrectiveAction {
        return this._correctiveActions.slice().find(e => e.id == id);
    }
    
    get correctiveActionDetails(){
        return this.individualCAItem;
    } 

    setAuditFindingCaId(id){
        this.auditFindingCaId = id;
    }

    unsetAuditFindingCaId(){
        this.auditFindingCaId = null;
    }


    @action
    clearUpdateDocumentDetails() {
        this._updateDocumentDetails = [];
        this.preview_url = null;
    }
    

    @action
    setDocumentImageDetails(details: Image, url: string, type: string) {
        if (type == 'logo') {
            this._imageDetails = details;
            this.preview_url = url;
        }
        else {
            this._updateDocumentDetails.push(details);
            this.preview_url = url;
        }
    }

    

    @action
    setSelectedImageDetails(imageDetails){
        
            this.selected_preview_url = imageDetails;
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
            var b_pos = this._updateDocumentDetails.findIndex(e => e.token == token)
            if(b_pos != -1){
                if(this._updateDocumentDetails[b_pos].hasOwnProperty('is_new')){
                    this._updateDocumentDetails.splice(b_pos,1);
                }
                else{
                    this._updateDocumentDetails[b_pos]['is_deleted'] = true;
                }
            }
        }
    }
    
    @computed
    get getDocumentDetails(): Image[]{
        return this._updateDocumentDetails.slice();
    }

    @action
    setCorrectiveActionHistory(response: caHistoryPaginationData) {
        this.CorrectiveActionHistoryItem = response.data;
        this.historyCurrentPage = response.current_page;
        this.historyItemsPerPage = response.per_page;
        this.historyTotalItems = response.total;
        this.historyLoaded = true;
    }


    @action
    setHistoryCurrentPage(current_page: number) {
        this.historyCurrentPage = current_page;
    }

    @computed
    get historyData():caHistoryData[]{
        return this.CorrectiveActionHistoryItem.slice();
    }

    @action
    unsetCorrectiveActionHistory() {
        this.CorrectiveActionHistoryItem = null;
        this.historyLoaded = false;
    }

}




export const AmFindingCAStore = new Store();

