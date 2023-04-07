
import { observable, action, computed } from "mobx-angular";

import { DocumentTypes,DocumentTypesPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-types';


class Store {
    @observable
    private _documentTypes: DocumentTypes[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'document_types.created_at';

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
    setDocumentType(response: DocumentTypesPaginationResponse) {
        this._documentTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true; 
    }

    @action
    unsetDocumentType(){
        this._documentTypes=[];
        this.loaded = false; 
    }

    @action
    setAllDocumenTypes(document: DocumentTypes[]) {
        this._documentTypes = document;
        this.loaded = true;
    }

    @computed
    get allItems(): DocumentTypes[] {        
        return this._documentTypes.slice();
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getDocumentTypeById(id: number): DocumentTypes {
        return this._documentTypes.slice().find(e => e.id == id);
    }
  
}

export const DocumentTypeMasterStore = new Store();

