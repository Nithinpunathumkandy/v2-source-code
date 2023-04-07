
import { observable, action, computed } from "mobx-angular";

import { DocumentSubCategory,DocumentSubCategoryPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-sub-categories';


class Store {
    @observable
    private _documentSubCategories: DocumentSubCategory[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'document_sub_categories.created_at';

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
    setDocumentSubCategory(response: DocumentSubCategoryPaginationResponse) {
        

        this._documentSubCategories = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllDocumentSubCategories(document: DocumentSubCategory[]) {
       
        this._documentSubCategories = document;
        this.loaded = true;
        
    }
    @computed
    get allItems(): DocumentSubCategory[] {
        
        return this._documentSubCategories.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getDocumentSubCategoryById(id: number): DocumentSubCategory {
        return this._documentSubCategories.slice().find(e => e.id == id);
    }
  
}

export const DocumentSubCategoryMasterStore = new Store();

