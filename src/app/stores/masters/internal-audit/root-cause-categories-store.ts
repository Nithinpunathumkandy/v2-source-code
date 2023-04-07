import { observable, action, computed } from "mobx-angular";

import { RootCauseCategory,RootCauseCategoryPaginationResponse } from 'src/app/core/models/masters/internal-audit/root-cause-categories';


class Store {
    @observable
    private _rootCauseCategoryList: RootCauseCategory[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'root_cause_categories.created_at';


    @observable
    totalItems: number = null;

    @observable
    from: number = null;

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
    setRootCauseCategory(response: RootCauseCategoryPaginationResponse) {
        
        this._rootCauseCategoryList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;

        this.loaded = true;
       
    }

    @action
    setAllRootCauseCategory(audit: RootCauseCategory[]) {
       
        this._rootCauseCategoryList = audit;
        this.loaded = true;
        
    }
    @computed
    get allItems(): RootCauseCategory[] {
        
        return this._rootCauseCategoryList.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    get LastInsertedId():number{
        if(this.lastInsertedId) 
            return this.lastInsertedId;
        else 
            return null;
    }

    @action
    getRootCauseCategoryById(id: number): RootCauseCategory {
        return this._rootCauseCategoryList.slice().find(e => e.id == id);
    }
  
}

export const RootCauseCategoryMasterStore = new Store();


