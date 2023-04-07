
import { observable, action, computed } from "mobx-angular";

import { IsmsRiskMatrixCalculationMethod,IsmsRiskMatrixCalculationMethodPaginationResponse } from 'src/app/core/models/masters/Isms/isms-risk-matrix-calculation-method';


class Store {
    @observable
    private _ismsRiskMatrixCalculationMethod: IsmsRiskMatrixCalculationMethod[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'isms_risk_matrix_calculation_method.created_at';

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
    setIsmsRiskMatrixCalculationMethod(response: IsmsRiskMatrixCalculationMethodPaginationResponse) {
        this._ismsRiskMatrixCalculationMethod = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true; 
    }

    @action
    setAllIsmsRiskMatrixCalculationMethod(document: IsmsRiskMatrixCalculationMethod[]) {
        this._ismsRiskMatrixCalculationMethod = document;
        this.loaded = true;
    }

    @computed
    get allItems(): IsmsRiskMatrixCalculationMethod[] {        
        return this._ismsRiskMatrixCalculationMethod.slice();
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getIsmsRiskMatrixCalculationMethodsById(id: number): IsmsRiskMatrixCalculationMethod {
        return this._ismsRiskMatrixCalculationMethod.slice().find(e => e.id == id);
    }
  
}

export const IsmsRiskMatrixCalculationMethodMasterStore = new Store();

