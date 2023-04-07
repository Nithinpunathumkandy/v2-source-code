
import { observable, action, computed } from "mobx-angular";

import { Auditors,AuditorsDetails } from 'src/app/core/models/internal-audit/auditors/auditors';


class Store {
    @observable
    private _auditors: Auditors[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalAuditors:number = null;

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
    setAllAuditors(response: AuditorsDetails) {
        

        this._auditors = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    
    @computed
    get allItems() {
        
        return this._auditors.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

     @action
    getAuditorsById(id: number): Auditors {
         return this._auditors.slice().find(e => e.id == id);
    }

    @action
    unsetAuditors(){
        this._auditors = [];
        this.loaded = false;
    }
  
}

export const AuditorsStore = new Store();

