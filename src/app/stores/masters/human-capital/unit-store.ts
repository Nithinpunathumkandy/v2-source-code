
import { observable, action, computed } from "mobx-angular";

import { Unit,UnitPaginationResponse } from 'src/app/core/models/masters/human-capital/unit';


class Store {
    @observable
    private _units: Unit[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'units.created_at';

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
    setUnit(response: UnitPaginationResponse) {
        

        this._units = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllUnits(unit: Unit[]) {
       
        this._units = unit;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): Unit[] {
        
        return this._units.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getUnitById(id: number): Unit {
        return this._units.slice().find(e => e.id == id);
    }
  
}

export const UnitMasterStore = new Store();

