import { observable, action, computed } from "mobx-angular";

import { DocumentAccessType , DocumentAccessTypePaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-access-type';

class Store {
    @observable
    private _documentAccessTypes: DocumentAccessType[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'document_access_types.created_at';

    @observable
    totalItems: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

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
    setDocumentAccessType(response: DocumentAccessTypePaginationResponse) {
        
        this._documentAccessTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
       
    }

    @action
    setAllDocumentAccessTypes(documentAccessType: DocumentAccessType[]) {
       
        this._documentAccessTypes = documentAccessType;
        this.loaded = true;
        
    }
    @computed
    get allItems(): DocumentAccessType[] {
        
        return this._documentAccessTypes.slice();
    }


}
export const DocumentAccessTypeMasterStore = new Store();