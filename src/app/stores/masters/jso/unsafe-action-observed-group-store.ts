
import { observable, action, computed } from "mobx-angular";

import { JsoUnsafeActionObservedGroup,JsoUnsafeActionObservedGroupPaginationResponse } from 'src/app/core/models/masters/jso/unsafe-action-observed-group';


class Store {
    @observable
    private _jsoUnsafeActionObservedGroup: JsoUnsafeActionObservedGroup[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'jso_unsafe_action_observed_group.created_at';

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
    setJsoUnsafeActionObservedGroup(response: JsoUnsafeActionObservedGroupPaginationResponse) {
        

        this._jsoUnsafeActionObservedGroup = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;

    }

    @action
    setAllJsoUnsafeActionObservedGroup(jsoUnsafeActionObservedGroup: JsoUnsafeActionObservedGroup[]) {
       
        this._jsoUnsafeActionObservedGroup = jsoUnsafeActionObservedGroup;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): JsoUnsafeActionObservedGroup[] {
        
        return this._jsoUnsafeActionObservedGroup.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getJsoUnsafeActionObservedGroupById(id: number): JsoUnsafeActionObservedGroup {
        return this._jsoUnsafeActionObservedGroup.slice().find(e => e.id == id);
    }
  
}

export const JsoUnsafeActionObservedGroupMasterStore = new Store();

