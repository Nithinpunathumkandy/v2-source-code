import { action, computed, observable } from "mobx-angular";
import { AmAuditDocumentTypes, AmAuditDocumentTypesPaginationResponse, AmAuditSingle } from "src/app/core/models/masters/audit-management/am-audit-document-types";

class Store {
    @observable
    private _amAuditDocumentTypes: AmAuditDocumentTypes[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'am_audit_document_types.created_at';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;

    
    @observable
    individualAmAudit: AmAuditSingle;

    @observable
    individualLoaded: boolean = false;
    
    searchText: string;
    
    @action
    setAmAuditDocumentTypes(response: AmAuditDocumentTypesPaginationResponse) {
        this._amAuditDocumentTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true; 
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
    updateAuditDocumentType(type: any) {
        const types: AmAuditDocumentTypes[] = this._amAuditDocumentTypes.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._amAuditDocumentTypes=types;
        }
    }
    @action
    setLastInserted(id: number){
        this.lastInsertedId = id;
    }

    @action
    setindividualAmAudit(amAudit: AmAuditSingle){
        this.individualAmAudit=amAudit;
        this.individualLoaded = true;
    }

    @action
    setAllAmAuditDocumentTypes(type: AmAuditDocumentTypes[]) {
        this._amAuditDocumentTypes = type;
        this.loaded = true;
    }


    @computed
    get amAudit(): AmAuditDocumentTypes[] {
        
        return this._amAuditDocumentTypes.slice();
    }

    @action
    getDocumentTypeById(id: number): AmAuditDocumentTypes {
        return this._amAuditDocumentTypes.slice().find(e => e.id == id);
    }

    @computed
    get allItems(): AmAuditDocumentTypes[] {        
        return this._amAuditDocumentTypes.slice();
    }
    
    @computed    
    get lastInserted():number{
        if(this.lastInsertedId) 
            return this.lastInsertedId;
        else 
            return null;
    }

     
    get individualAmAuditId(){
        return this.individualAmAudit;
    } 

}

export const AmAuditDocumentTypesMasterStore = new Store();