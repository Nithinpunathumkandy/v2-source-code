import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { RiskMatrixCalculationMethod,RiskMatrixCalculationMethodPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-matrix-calculation-method';

class Store {
    @observable
    private _riskMatrixCalculationMethod: RiskMatrixCalculationMethod[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'risk_matrix_calculation_method_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setRiskMatrixCalculationMethod(response: RiskMatrixCalculationMethodPaginationResponse) {
        
        this._riskMatrixCalculationMethod = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllRiskMatrixCalculationMethod(riskMatrixCalculationMethod: RiskMatrixCalculationMethod[]) {
       
        this._riskMatrixCalculationMethod = riskMatrixCalculationMethod;
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
    get allItems(): RiskMatrixCalculationMethod[] {
        return this._riskMatrixCalculationMethod.slice();
    }

}

export const RiskMatrixCalculationMethodMasterStore = new Store();