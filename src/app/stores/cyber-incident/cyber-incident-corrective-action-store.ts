import { observable, action, computed } from "mobx-angular";
import { Image } from "src/app/core/models/image.model";
import { caHistoryData, caHistoryPaginationData, CyberIncidentCorrectiveAction, CyberIncidentCorrectiveActionPaginationResponse } from "src/app/core/models/cyber-incident/cyber-incident-corrective-action";
class Store {

@observable
_correctiveActions : CyberIncidentCorrectiveAction[] = [];

@observable
loaded: boolean = false;

@observable
checkListLoaded: boolean = false;

@observable
currentPage: number = 1;

@observable
itemsPerPage: number = 15;

@observable
totalItems: number = null;

@observable
from: number = null;

@observable
orderItem: string = 'corrective_action.title';

@observable
last_page: number = null;

@observable
orderBy: 'asc' | 'desc' = 'desc';

searchText: string;

new_ca_id: number = null;

@observable
preview_url: string;

selected: number;

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
document_preview_available: boolean = false;

@observable
private _documentDetails: Image[] = [];

@observable
hideSubMenu: boolean = false;

@observable
auditFindingId: number = null;
@observable
individualLoaded: boolean = false;

@observable
    individualCorrectiveAction: CyberIncidentCorrectiveAction;

@action
setCurrentPage(current_page: number) {
    this.currentPage = current_page;
}

@action
setCICorrectiveActions(response : CyberIncidentCorrectiveActionPaginationResponse){
    this._correctiveActions = response.data;
    this.currentPage = response.current_page;
    this.itemsPerPage = response.per_page;
    this.totalItems = response.total;
    this.from = response.from;
    this.loaded = true;
}

setIncidentCorrectiveActions(caItems: CyberIncidentCorrectiveAction[]){
    this._correctiveActions = caItems;
    this.loaded = true;
}

@computed
get allItems() {
    return this._correctiveActions
}

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
    unsetSelectedItemDetails(){
        this.individualLoaded = false;
        this.individualCorrectiveAction = null;
    }

    @action
    setIndividualCorrectiveActionDetails(actionPlan: CyberIncidentCorrectiveAction) {
       
        this.individualCorrectiveAction = actionPlan;
        this.individualLoaded = true;
        
    }

    @action
    unsetCorrectiveActions(){
        this._correctiveActions = [];
        this.currentPage = 1;
        this.loaded = false;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

  @computed
    get docDetails(): Image[] {
        return this._documentDetails;
    }
    

    @action
    getActionPlanById(id: number): CyberIncidentCorrectiveAction {
        return this._correctiveActions.slice().find(e => e.id == id);
    }
    @computed
    get correctiveActionDetails(){
        return this.individualCorrectiveAction;
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

    @action
    setSelected(value:number){
        this.selected = value;
    }

    @action
    setSubMenuHide(value: boolean) {
        this.hideSubMenu = value
    }

    @computed
    get tabHides() {
        return this.hideSubMenu;
    }

    get selectedItem():number{
        return this.selected;
    }

    @computed
    get initialItemId():number{
        return this._correctiveActions[0].id
    }

    @observable
    private _updateDocumentDetails: Image[] = [];

    @observable
    selected_preview_url: string;

    @observable
    private _imageDetails: Image = null;

    @observable
    update_document_preview_available = false;

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
        console.log(this._updateDocumentDetails)
    }
    
    @computed
    get getDocumentDetails(): Image[]{
        return this._updateDocumentDetails.slice();
    }

}


export const CyberIncidentCorrectiveActionStore = new Store()