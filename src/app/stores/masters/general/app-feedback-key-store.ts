
import { observable, action, computed } from "mobx-angular";

import { AppFeedbackKey,AppFeedbackKeyPaginationResponse } from 'src/app/core/models/masters/general/app-feedback-key';


class Store {
    @observable
    private _appFeedbackKeys: AppFeedbackKey[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'key_title';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

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
    setAppFeedbackKey(response: AppFeedbackKeyPaginationResponse) {
        

        this._appFeedbackKeys = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllAppFeedbackKeys(appFeedbackKey: AppFeedbackKey[]) {
       
        this._appFeedbackKeys = appFeedbackKey;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): AppFeedbackKey[] {
        
        return this._appFeedbackKeys.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getAppFeedbackKeyById(id: number): AppFeedbackKey {
        return this._appFeedbackKeys.slice().find(e => e.id == id);
    }
  
}

export const AppFeedbackKeyMasterStore = new Store();

