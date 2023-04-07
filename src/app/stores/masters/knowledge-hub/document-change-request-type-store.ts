import { observable, action, computed } from "mobx-angular";

import { DocumentChangeRequestType , DocumentChangeRequestTypePaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-change-request-type';

class Store {
    @observable
    private _documentChangeRequestTypes: DocumentChangeRequestType[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'document_change_request_type_language.created_at';

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
    setDocumentChangeRequestType(response: DocumentChangeRequestTypePaginationResponse) {
        
        this._documentChangeRequestTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
       
    }

    @action
    setAllDocumentChangeRequestTypes(documentChangeRequestType: DocumentChangeRequestType[]) {
       
        this._documentChangeRequestTypes = documentChangeRequestType;
        this.loaded = true;
        
    }
    @computed
    get allItems(): DocumentChangeRequestType[] {
        
        return this._documentChangeRequestTypes.slice();
    }


}
export const DocumentChangeRequestTypesMasterStore = new Store();