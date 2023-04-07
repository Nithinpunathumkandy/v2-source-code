

import { observable, action, computed } from "mobx-angular";

import { AuditableItem,AuditableItemPaginationResponse } from 'src/app/core/models/masters/internal-audit/auditable-item';
import { Image } from "src/app/core/models/image.model";

class Store {
    @observable
    private _auditableItems: AuditableItem[] = [];

    @observable 
    loaded:boolean=false;


    @observable
    individualLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    individualAuditItem: AuditableItem;

    @observable
    orderItem: string = 'auditable_items.created_at';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    preview_url: string;

    @observable
    document_preview_available: boolean = false;

    @observable
    private _documentDetails: Image[] = [];


    @observable
    last_page: number = null;

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
    setIndividualAuditableItem(audit: AuditableItem) {
       
        this.individualAuditItem = audit;
        this.individualLoaded = true;
        
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
    setAuditableItem(response: AuditableItemPaginationResponse) {
        

        this._auditableItems = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllAuditableItem(audit: AuditableItem[]) {
       
        this._auditableItems = audit;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): AuditableItem[] {
        
        return this._auditableItems.slice();
    }

    @computed
    get docDetails(): Image[] {
        return this._documentDetails.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getAuditableItemById(id: number): AuditableItem {
        return this._auditableItems.slice().find(e => e.id == id);
    }

    get individualAuditableItemId(){
        return this.individualAuditItem;
    } 
  
  
}

export const AuditableItemMasterStore = new Store();

