import { observable, action, computed } from "mobx-angular";

import { DocumentSystemType , DocumentSystemTypePaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-system-type';

class Store {
    @observable
    private _documentSystemTypes: DocumentSystemType[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'ref_no';

    @observable
    totalItems: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

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
    setDocumentSystemType(response: DocumentSystemTypePaginationResponse) {
        
        this._documentSystemTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
       
    }

    @action
    setAllDocumentSystemTypes(documentSystemType: DocumentSystemType[]) {
       
        this._documentSystemTypes = documentSystemType;
        this.loaded = true;
        
    }
    @computed
    get allItems(): DocumentSystemType[] {
        
        return this._documentSystemTypes.slice();
    }


}
export const DocumentSystemTypeStore = new Store();