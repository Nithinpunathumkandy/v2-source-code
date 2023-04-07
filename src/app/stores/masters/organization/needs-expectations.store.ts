import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { NeedsExpectaions, NeedsExpectationsResponse } from "src/app/core/models/masters/organization/needs-expectations";

class Store {

    @observable
    private _needsExpectations: NeedsExpectaions[] = [];

    @observable
    loaded: boolean = false;

    @observable
    orderItem: string = 'need_and_expectations.created_at' ;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

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
    setNeedsExpectationsRespose(response: NeedsExpectationsResponse) {
        this._needsExpectations = response.data;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.currentPage = response.current_page;
        this.from = response.from;
        this.loaded = true;
    }

    get needsAndExpecations():NeedsExpectaions[]{
        return this._needsExpectations;
    }

    getNeedsandExpectationsById(id){
        return this._needsExpectations.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }
    
}

export const NeedsExpectationsStore = new Store();