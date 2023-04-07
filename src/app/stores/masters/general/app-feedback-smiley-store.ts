
import { observable, action, computed } from "mobx-angular";

import { AppFeedbackSmiley,AppFeedbackSmileyPaginationResponse } from 'src/app/core/models/masters/general/app-feedback-smiley';


class Store {
    @observable
    private _appFeedbackSmilies: AppFeedbackSmiley[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'smiley_title';

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
    setAppFeedbackSmiley(response: AppFeedbackSmileyPaginationResponse) {
        

        this._appFeedbackSmilies = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllAppFeedbackSmilies(appFeedbackSmiley: AppFeedbackSmiley[]) {
       
        this._appFeedbackSmilies = appFeedbackSmiley;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): AppFeedbackSmiley[] {
        
        return this._appFeedbackSmilies.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getAppFeedbackSmileyById(id: number): AppFeedbackSmiley {
        return this._appFeedbackSmilies.slice().find(e => e.id == id);
    }
  
}

export const AppFeedbackSmileyMasterStore = new Store();

