
import { observable, action, computed } from "mobx-angular";

import { ExternalAudit ,ExternalAuditPaginationResponse  } from 'src/app/core/models/external-audit/external-audit/external-audit';

import { Image } from "src/app/core/models/image.model";
class Store {
    @observable
    private _externalAudits: ExternalAudit[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    auditId: number = null;

    @observable
    document_preview_available:boolean = false

    @observable
    private _documentDetails: Image[] = [];

    @observable
    individualExternalAuditItem: ExternalAudit;

    @observable
    currentPage: number = 1;

    @observable
    individualLoaded: boolean = false;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'external_audits.created_at';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    preview_url: string;

    @observable
    _msType = [];

    @observable
    _responsibleUser=[];


    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;

    searchText: string;
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
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
    setIndividualExternalAuditItem(audit: ExternalAudit) {
       
        this.individualExternalAuditItem = audit;
        this.individualLoaded = true;
        
    }

    @action
    unsetIndividualExternalAuditItem() {   
        this.individualExternalAuditItem = null;
        this.individualLoaded = false;    
    }

    @action
    setAuditId(id: number) {
        this.auditId = id;

    }

    @action
    setExternalAudit(response: ExternalAuditPaginationResponse) {
        

        this._externalAudits = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    unsetExternalAudit() {
        this._externalAudits = [];
        this.currentPage = 1;
        this.loaded = false;
    }

    @action
    setAllExternalAudits(externalAudit: ExternalAudit[]) {
       
        this._externalAudits = externalAudit;
        this.loaded = true;
        
    }

    @computed
    get docDetails(): Image[] {
        return this._documentDetails.slice();
    }
    
    @computed
    get allItems(): ExternalAudit[] {
        
        return this._externalAudits.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getExternalAuditById(id: number): ExternalAudit {
        return this._externalAudits.slice().find(e => e.id == id);
    }

    get individualExternalAuditItemId(){
        return this.individualExternalAuditItem;
    } 
  
}

export const ExternalAuditMasterStore = new Store();

