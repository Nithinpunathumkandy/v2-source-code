
import { observable, action, computed } from "mobx-angular";
import { BcsTypes, BcsTypesPaginationResponse } from "src/app/core/models/masters/bcm/bcs-type";



class Store {
    @observable
    private _bcsTypes: BcsTypes[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;z

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'business_continuity_strategy_types.created_at';

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
    setBcsTypes(response: BcsTypesPaginationResponse) {
        

        this._bcsTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllBcsTypes(bcsTypes: BcsTypes[]) {
       
        this._bcsTypes = bcsTypes;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): BcsTypes[] {
        
        return this._bcsTypes.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getBcsTypesById(id: number): BcsTypes {
        return this._bcsTypes.slice().find(e => e.id == id);
    }
  
}

export const BcsTypesMasterStore = new Store();

