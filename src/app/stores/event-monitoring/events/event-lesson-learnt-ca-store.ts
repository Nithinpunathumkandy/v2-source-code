import { observable, action, computed } from "mobx-angular";
import { CaPaginationResponse, CorrectiveActions, IndividualCorrectiveAction, caHistoryData, caHistoryPaginationData } from "src/app/core/models/event-monitoring/events/event-lesson-learnt-ca";
import { Image } from "src/app/core/models/image.model";
class Store {
    @observable
    private _ca: CorrectiveActions[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualLoaded: boolean = false;

    @observable
    LessonLearntCaId: number = null;

    @observable
    CorrectiveActionHistoryItem: caHistoryData[] = [];

    @observable
    historyCurrentPage: number = 1;

    @observable
    historyItemsPerPage: number = null;

    @observable
    historyTotalItems: number = null;


    @observable
    hideSubMenu: boolean = false;

    @observable
    historyLoaded: boolean = false;

    @observable
    individualCAItem: IndividualCorrectiveAction;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    lastInsertedId: number = null;

    @observable
    orderItem: string = 'event_monitor_ca.id';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @observable
    private _imageDetails: Image = null;

    @observable
    preview_url: string;

    @observable
    private _documentDetailsUpdate: Image[] = [];

    @observable
    selected: number;
    new_ca_id: number = null;

    @observable
    selectedEventId

    @observable 
    caStatus = []

    @action
    setCa(response: CaPaginationResponse) {

        this._ca = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
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
    setSubMenuHide(value:boolean){
        this.hideSubMenu = value
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setSelected(value:number){
        this.selected = value;
    }

    @action
    setIndividualCADetails(CorrectiveAction: IndividualCorrectiveAction) {
        this.individualCAItem = CorrectiveAction;
        this.individualLoaded = true;
    }

    @action
    setCaStatus(status) {
        this.caStatus = status;
    }

    @action
    unsetIndividualCADetails() {
        this.individualCAItem = null;
        this.individualLoaded = false;
    }

    @action
    setLessonLearntCaId(id: number) {
        this.LessonLearntCaId = id;

    }

    @computed
    get historyData():caHistoryData[]{
        return this.CorrectiveActionHistoryItem.slice();
    }

    @computed
    get caStatuss(){
        return this.caStatus.slice();
    }

    @action
    setHistoryCurrentPage(current_page: number) {
        this.historyCurrentPage = current_page;
    }

    @action
    unsetCorrectiveActionHistory() {
        this.CorrectiveActionHistoryItem = null;
        this.historyLoaded = false;
    }


    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }


    @action
    updateCa(type: CorrectiveActions) {
        const types: CorrectiveActions[] = this._ca.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._ca = types;
        }
    }

    get selectedItem():number{
        return this.selected;
    }
    

    @computed
    get Ca(): CorrectiveActions[] {

        return this._ca.slice();
    }
    @computed
    get allItems(): CorrectiveActions[] {

        return this._ca.slice();
    }

    get correctiveActionDetails() {
        return this.individualCAItem;
    }

    @computed
    get tabHides(){
        return this.hideSubMenu;
    }

    @action
    getCaById(id: number): CorrectiveActions {
        return this._ca.slice().find(e => e.id == id);
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

    @action
    unSetCorrectiveAction() {
        this._ca = [];
    }

    @computed
    get getDocumentDetails(): Image[]{
        return this._documentDetailsUpdate.slice();
    }

}

export const LessonLearntCaStore = new Store();