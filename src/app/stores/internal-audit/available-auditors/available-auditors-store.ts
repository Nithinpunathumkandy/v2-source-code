
import { observable, action, computed } from "mobx-angular";

import { AvailableAuditors,AvailableAuditorsPaginationResponse } from 'src/app/core/models/internal-audit/available-auditors/available-auditors';


class Store {
    @observable
    private _availableAuditors: AvailableAuditors[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'auditors_title';

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
    setAvailableAuditor(response: AvailableAuditorsPaginationResponse) {
        

        this._availableAuditors = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllAvailableAuditor(auditors: AvailableAuditors[]) {
       
        this._availableAuditors = auditors;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): AvailableAuditors[] {
        
        return this._availableAuditors;
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getAvailableAuditorsById(id: number): AvailableAuditors {
        return this._availableAuditors.slice().find(e => e.id == id);
    }
  
}

export const AvailableAuditorsStore = new Store();

