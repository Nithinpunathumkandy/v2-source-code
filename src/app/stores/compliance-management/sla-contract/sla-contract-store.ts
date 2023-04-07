import { action, computed, observable } from 'mobx';
import { IndividualSLAContracts, SLAContracts, SLAContractsPaginationResponse } from 'src/app/core/models/compliance-management/sla-contracts/sla-contract';
import { Image } from 'src/app/core/models/image.model';

class Store{
    @observable
    private _slaContracts:SLAContracts[] = [];

    @observable
    private _slaContractsDetails:IndividualSLAContracts;

    @observable
    private _slaContractsDocumentHistory;

    // @observable
    // public _unsafeActionDetails = [];

    @observable
    loaded: boolean = false;

    @observable
    slaDetails_loaded: boolean = false;

    @observable
    document_history_loaded: boolean = false;

    @observable
    logo_preview_available = false;

    @observable
    sla_preview_available = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    orderItem: string = 'documents.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    searchText: string;

    @observable
    sla_contract_id: number = null;

    @observable
    sla_category_form_modal: boolean = false;

    @observable
    private _documentDetails: Image = null;

    @observable
    preview_url: string;

    @observable
    selectedStatusCategory: string = 'valid';

    @observable
    dashboardParam: string = null;
    
    @computed
    get slaContractsList(): SLAContracts[] {
    return this._slaContracts;
    }

    @computed
    get slaContractDetails(): IndividualSLAContracts {
    return this._slaContractsDetails;
    }

    @computed
    get slaContractHistory() {
    return this._slaContractsDocumentHistory;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setSLAContracts(response: SLAContractsPaginationResponse){
        this._slaContracts = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setIndividualSLAContracts(details) {
        this.slaDetails_loaded = true;
        this._slaContractsDetails=details;
    }

    unsetIndividualSLAContracts(){
        this.slaDetails_loaded = false;
        this._slaContractsDetails = null;
        this._slaContractsDocumentHistory=null;
        this.document_history_loaded = false;
    }
   
    @action
    setDocumentHistory(details) {
        this._slaContractsDocumentHistory=details.data;
        this.document_history_loaded = true;
    }

    @action
    unsetDocumentHistory() {
        this._slaContractsDocumentHistory=null;
        this.document_history_loaded = false;
    }

    @action
    clearDocument() {
        this._documentDetails = null;
    }

    @action
    setDocumentImageDetails(details, url: string) {
       
            this._documentDetails = details;
            this.preview_url = url;
        
    }

    @action
    unsetDocumentImageDetails() {
        
            if (this._documentDetails.hasOwnProperty('is_new')) {
                this._documentDetails = null;
                this.preview_url = null;
            }
            else {
                this._documentDetails['is_deleted'] = true;             
            }        
    }

    get documentImage() {
        return this._documentDetails;
    }

    @action
    unsetSLAContracts(){
        this._slaContracts = [];
        this.currentPage = 1;
        this.loaded = false;
    }

    @action
    setDashboardParam(param:string){
        this.dashboardParam = param
    }

    @computed
    get dashboardParameter(){
        return this.dashboardParam;
    }

    @action
    unsetDashboardParam() {
        this.dashboardParam = null;
    }

}

export const SLAContractStore = new Store();