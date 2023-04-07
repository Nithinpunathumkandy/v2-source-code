import { observable, action, computed } from "mobx-angular";
import { FocusArea, FocusAreaPaginationResponse } from "src/app/core/models/masters/strategy/focus-area.model";
import { ObjectivePaginationResponse, Objectives } from "src/app/core/models/masters/strategy/objective.model";
class Store {
    @observable
    private _objective: Objectives[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;z

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'objectives.created_at';

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
    setObjective(response: ObjectivePaginationResponse) {
        

        this._objective = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllObjective(objective: Objectives[]) {
       
        this._objective = objective;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): Objectives[] {
        
        return this._objective.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getObjectiveById(id: number): Objectives {
        return this._objective.slice().find(e => e.id == id);
    }
}
export const ObjectiveMasterStore = new Store();