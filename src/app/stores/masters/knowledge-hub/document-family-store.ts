
import { observable, action, computed } from "mobx-angular";

import { DocumentFamily,DocumentFamilyPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-family';


class Store {
    @observable
    private _documentFamilies: DocumentFamily[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'document_families.created_at';

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
    setDocumentFamily(response: DocumentFamilyPaginationResponse) {
        

        this._documentFamilies = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllDocumentFamilies(document: DocumentFamily[]) {
       
        this._documentFamilies = document;
        this.loaded = true;
        
    }
    @computed
    get allItems(): DocumentFamily[] {
        
        return this._documentFamilies.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getDocumentFamilyById(id: number): DocumentFamily {
        return this._documentFamilies.slice().find(e => e.id == id);
    }
  
}

export const DocumentFamilyMasterStore = new Store();

