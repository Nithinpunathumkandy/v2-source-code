import { action, computed, observable } from 'mobx';
import { caHistoryData, caHistoryPaginationData, FindingsCorrectiveActionPaginationResponse, FindingsCorrectiveActions, IndividualCorrectiveAction } from 'src/app/core/models/non-conformity/finding-corrective-action';
import { Image } from "src/app/core/models/image.model";

class Store {
    @observable
    private _findingCorrectiveAction: FindingsCorrectiveActions[] = [];

    @observable
    individualCAItem: IndividualCorrectiveAction;

    @observable
    CorrectiveActionHistoryItem: caHistoryData[] = [];

    @observable
    individualLoaded: boolean = false;

    @observable
    historyLoaded: boolean = false;

    @observable
    historyCurrentPage: number = 1;

    @observable
    historyItemsPerPage: number = null;

    @observable
    historyTotalItems: number = null;

    @observable
    FindingCorrectiveActionId: number = null;

    @observable
    update_document_preview_available = false;

    @observable
    private _updateDocumentDetails: Image[] = [];

    @observable
    private _imageDetails: Image = null;

    @observable
    selected_preview_url: string;

    @observable
    updatePreview_url: string;

    @observable
    new_ca_id: number = null;

    @observable
    hideSubMenu: boolean = false;

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    last_page: number = null;

    @observable
    totalItems: number = null;

    @observable
    lastInsertedId: number = null;

    @observable
    orderItem: string = 'finding_corrective_actions.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    // @observable
    // findingsDetails: any;

    @observable
    private _documentDetails: Image[] = [];

    @observable
    preview_url: string;

    searchText: string;

    @action
    setFindingCorrectiveAction(response: FindingsCorrectiveActionPaginationResponse) {

        this._findingCorrectiveAction = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.last_page = response.last_page;
        this.loaded = true;
    }

    @action
    unsetFindingCorrectiveAction() {
        this._findingCorrectiveAction = [];
        this.loaded = false;
    }

    @action
    setCorrectiveActionHistory(response: caHistoryPaginationData) {
        this.CorrectiveActionHistoryItem = response.data;
        this.historyCurrentPage = response.current_page;
        this.historyItemsPerPage = response.per_page;
        this.historyTotalItems = response.total;
        this.historyLoaded = true;
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
    setHistoryCurrentPage(current_page: number) {
        this.historyCurrentPage = current_page;
    }


    @action
    setIndividualCADetails(CorrectiveAction: IndividualCorrectiveAction) {
        this.individualCAItem = CorrectiveAction;
        this.individualLoaded = true;
    }

    @action
    unsetIndividualCADetails() {
        this.individualCAItem = null;
        this.individualLoaded = false;
    }

    @action
    clearDocumentDetails() {
        this._documentDetails = [];
        this.preview_url = null;
    }

    @action
    setDocumentDetails(details: Image, url: string) {
        // this._documentDetails = details;
        this._documentDetails.push(details);
        this.preview_url = url;
    }
    @action
    unsetDocumentDetails(token?: string) {
        // if (this._documentDetails.hasOwnProperty('is_new')) {
        //     this._documentDetails = [];
        //     this.preview_url = null;
        // }
        // else {
        //     this._documentDetails['is_deleted'] = true;
        // }
        var b_pos = this._documentDetails.findIndex(e => e.token == token)
        if (b_pos != -1) {
            if (this._documentDetails[b_pos].hasOwnProperty('is_new')) {
                this._documentDetails.splice(b_pos, 1);
            }
            else {
                this._documentDetails[b_pos]['is_deleted'] = true;
            }
        }
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
    setFindingCorrectiveActionId(id: number) {
        this.FindingCorrectiveActionId = id;

    }


    @action
    updateFindings(type: FindingsCorrectiveActions) {
        // const types: Findings[] = this._findings.slice();
        // const index: number = types.findIndex(e => e.id == type.id);
        // if (index != -1) {
        //     types[index] = type;
        //     this._findings = types;
        // }
        // this.individualFindings=type
    }

    @computed
    get findingCorrectiveAction(): FindingsCorrectiveActions[] {

        return this._findingCorrectiveAction.slice();
    }
    @computed
    get allItems(): FindingsCorrectiveActions[] {

        return this._findingCorrectiveAction.slice();
    }

    @action
    getFindingCorrectiveActionById(id: number): FindingsCorrectiveActions {
        return this._findingCorrectiveAction.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedId(id: number) {
        this.lastInsertedId = id;
    }

    get LastInsertedId(): number {
        if (this.lastInsertedId)
            return this.lastInsertedId;
        else
            return null;
    }

    get correctiveActionDetails() {
        return this.individualCAItem;
    }

    @computed
    get docDetails(): Image[] {
        return this._documentDetails;
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
    clearupdateDocumentDetails() {
        this._updateDocumentDetails = [];
        this.preview_url = null;
    }
    @action
    setSelectedImageDetails(imageDetails){
        
            this.selected_preview_url = imageDetails;
    }

    @computed
    get getDocumentDetails(): Image[]{
        return this._updateDocumentDetails.slice();
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
            //this._brocureDetails = null;
            //this.brochure_preview_url = null;
        }

       
    }
}

export const FindingCorrectiveActionStore = new Store();