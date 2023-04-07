
import { observable, action, computed } from "mobx-angular";

import { DocumentCategory,DocumentCategoryPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-category';


class Store {
    @observable
    private _documentCategories: DocumentCategory[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'document_categories.created_at';

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
    setDocumentCategories(response: DocumentCategoryPaginationResponse) {
        

        this._documentCategories = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllDocumentCategories(document: DocumentCategory[]) {
       
        this._documentCategories = document;
        this.loaded = true;
        
    }
    @computed
    get allItems(): DocumentCategory[] {
        
        return this._documentCategories.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getDocumentCategoriesById(id: number): DocumentCategory {
        return this._documentCategories.slice().find(e => e.id == id);
    }
  
}

export const DocumentCategoryMasterStore = new Store();

