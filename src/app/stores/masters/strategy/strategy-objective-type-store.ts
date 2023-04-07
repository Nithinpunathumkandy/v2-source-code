import { Image } from "src/app/core/models/image.model";
import { observable, action, computed } from "mobx-angular";
import { StrategyObjectiveTypes, StrategyObjectiveTypesPaginationResponse } from "src/app/core/models/masters/strategy/strategy-objective-types";

class Store {
    
    @observable
    private _strategyObjectiveTypes: StrategyObjectiveTypes[] = [];

    @observable
    private _objectiveTypesWithoutChild = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;z

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'strategy_objective_types.title';

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
    setstrategyObjectiveTypes(response: StrategyObjectiveTypesPaginationResponse) {
        
        this._strategyObjectiveTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setAllstrategyObjectiveTypes(externalAuditTypes: StrategyObjectiveTypes[]) {
        this._strategyObjectiveTypes = externalAuditTypes;
        this.loaded = true; 
    }
    
    @computed
    get allItems(): StrategyObjectiveTypes[] {

        return this._strategyObjectiveTypes.slice();
    }

    @action
    setObjectiveTypesWithoutChild(response) {
        this._objectiveTypesWithoutChild = response; 
    }
    
    @computed
    get objectiveTypesWithoutChild(){ 
        return this._objectiveTypesWithoutChild.slice();
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getstrategyObjectiveTypesById(id: number): StrategyObjectiveTypes {
        return this._strategyObjectiveTypes.slice().find(e => e.id == id);
    }
    
    @action
    unsetAllstrategyObjectiveTypes() {
        this._strategyObjectiveTypes = [];
        this.loaded = false;
    }
}
export const StrategyObjectiveTypeMasterStore = new Store();