import { observable, action, computed } from "mobx-angular";
import { AggregationTypes, AggregationTypesPaginationResponse } from "src/app/core/models/masters/strategy/aggregation-types";

class Store {
    @observable
    private _aggregationTypes: AggregationTypes[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'aggregation_types_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setAggregationTypes(response: AggregationTypesPaginationResponse) {        
        this._aggregationTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllAggregationTypes(AggregationTypes: AggregationTypes[]) {
        this._aggregationTypes = AggregationTypes;
        this.loaded = true;
    }

    @action
    setCurrentPage(currentPage: number) {
        this.currentPage = currentPage;
    }

    @action
    setOrderBy(orderBy: 'asc' | 'desc') {
        this.orderBy = orderBy;
    }

    @computed
    get allItems(): AggregationTypes[] {
        return this._aggregationTypes.slice();
    }

}

export const AggregationTypesMasterStore = new Store();