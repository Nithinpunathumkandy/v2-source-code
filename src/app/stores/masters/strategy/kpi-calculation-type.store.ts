import { observable, action, computed } from "mobx-angular";
import { KpiCalculationTypes, KpiCalculationTypesPaginationResponse } from "src/app/core/models/masters/strategy/kpi-calculation-types";

class Store {
    @observable
    private _kpiCalculationTypes: KpiCalculationTypes[] = [];

    @observable
    loaded: boolean = false;


    @observable
    currentPage: number = 1;

   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'kpi_calculation_types.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setKpiCalculationTypes(response: KpiCalculationTypesPaginationResponse) {
        
        this._kpiCalculationTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllKpiTypes(kpiCalculationTypes: KpiCalculationTypes[]) {
       
        this._kpiCalculationTypes = kpiCalculationTypes;
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
    get allItems(): KpiCalculationTypes[] {
        return this._kpiCalculationTypes.slice();
    }


}

export const KpiCalculationTypesMasterStore = new Store();