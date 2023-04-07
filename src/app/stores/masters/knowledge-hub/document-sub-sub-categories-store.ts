
import { observable, action, computed } from "mobx-angular";

import { DocumentSubSubCategory,DocumentSubSubCategoryPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-sub-sub-categories';


class Store {
    @observable
    private _documentSubSubCategories: DocumentSubSubCategory[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'document_sub_sub_categories.created_at';

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
    setDocumentSubSubCategory(response: DocumentSubSubCategoryPaginationResponse) {
        

        this._documentSubSubCategories = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllDocumentSubSubCategories(document: DocumentSubSubCategory[]) {
       
        this._documentSubSubCategories = document;
        this.loaded = true;
        
    }
    @computed
    get allItems(): DocumentSubSubCategory[] {
        
        return this._documentSubSubCategories.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getDocumentSubSubCategoryById(id: number): DocumentSubSubCategory {
        return this._documentSubSubCategories.slice().find(e => e.id == id);
    }
  
}

export const DocumentSubSubCategoryMasterStore = new Store();

