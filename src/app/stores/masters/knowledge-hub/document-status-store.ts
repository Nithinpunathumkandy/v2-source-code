
import { observable, action, computed } from "mobx-angular";
import {DocumentStatus,DocumentStatusPaginationResponse} from 'src/app/core/models/masters/knowledge-hub/document-status';


class Store{
    @observable
    private _documentStatus:DocumentStatus[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'document_status_language.created_at';

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
    setDocumentStatus(response: DocumentStatusPaginationResponse) {
        

        this._documentStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllDocumentStatus(document: DocumentStatus[]) {
       
        this._documentStatus = document;
        this.loaded = true;
        
    }
    @computed
    get allItems(): DocumentStatus[] {
        
        return this._documentStatus.slice();
    }
}

export const DocumentStatusMasterStore = new Store();