
import { observable, action, computed } from "mobx-angular";

import { JsoObservationType,JsoObservationTypePaginationResponse } from 'src/app/core/models/masters/jso/jso-observation-type';


class Store {
    @observable
    private _jsoObservationType: JsoObservationType[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'jso_observation_type.created_at';

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
    setJsoObservationType(response: JsoObservationTypePaginationResponse) {
        

        this._jsoObservationType = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllJsoObservationType(jsoObservationType: JsoObservationType[]) {
       
        this._jsoObservationType = jsoObservationType;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): JsoObservationType[] {
        
        return this._jsoObservationType.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getJsoObservationTypeById(id: number): JsoObservationType {
        return this._jsoObservationType.slice().find(e => e.id == id);
    }
  
}

export const JsoObservationTypeMasterStore = new Store();

