
import { observable, action, computed } from "mobx-angular";

import { Tag,TagPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/tag';


class Store {
    @observable
    private _documentTags: Tag[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string  = 'tags.created_at';

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
    setTag(response: TagPaginationResponse) {
        

        this._documentTags = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllTags(documentTag: Tag[]) {
       
        this._documentTags = documentTag;
        this.loaded = true;
        
    }
    @computed
    get allItems(): Tag[] {
        
        return this._documentTags.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getTagById(id: number): Tag {
        return this._documentTags.slice().find(e => e.id == id);
    }
  
}

export const TagMasterStore = new Store();

