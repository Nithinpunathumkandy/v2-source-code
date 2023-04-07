import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { StrategyKpiDataTypes, StrategyKpiDataTypesPaginationResponse } from "src/app/core/models/masters/strategy/strategy_kpi_data_types";

class Store {
    @observable
    private _strategyKpiDataTypes: StrategyKpiDataTypes[] = [];

    @observable
    loaded: boolean = false;


    @observable
    currentPage: number = 1;

   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'strategy_kpi_data_types.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setStrategyKpiDataTypes(response: StrategyKpiDataTypesPaginationResponse) {
        
        this._strategyKpiDataTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllStrategyKpiDataTypes(StrategyKpiDataTypes: StrategyKpiDataTypes[]) {
       
        this._strategyKpiDataTypes = StrategyKpiDataTypes;
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
    get allItems(): StrategyKpiDataTypes[] {
        return this._strategyKpiDataTypes.slice();
    }


}

export const StrategyKpiDataTypesMasterStore = new Store();