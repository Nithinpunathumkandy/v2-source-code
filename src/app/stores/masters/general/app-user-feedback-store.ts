
import { observable, action, computed } from "mobx-angular";

import { AppUserFeedback,AppUserFeedbackPaginationResponse } from 'src/app/core/models/masters/general/app-user-feedback';


class Store {
    @observable
    private _appUserFeedbacks: AppUserFeedback[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'app_user_feedback_title';

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
    setAppUserFeedback(response: AppUserFeedbackPaginationResponse) {
        

        this._appUserFeedbacks = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllAppUserFeedbacks(appUserFeedback: AppUserFeedback[]) {
       
        this._appUserFeedbacks = appUserFeedback;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): AppUserFeedback[] {
        
        return this._appUserFeedbacks.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getAppUserFeedbackById(id: number): AppUserFeedback {
        return this._appUserFeedbacks.slice().find(e => e.id == id);
    }
  
}

export const AppUserFeedbackMasterStore = new Store();

