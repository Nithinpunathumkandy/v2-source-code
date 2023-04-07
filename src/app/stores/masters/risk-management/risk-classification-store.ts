import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { RiskClassification,RiskClassificationPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-classification';

class Store {
    @observable
    private _riskClassification: RiskClassification[] = [];

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
    orderItem: string = 'risk_classification_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setRiskClassification(response: RiskClassificationPaginationResponse) {
        
        this._riskClassification = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllRiskClassification(riskClassification: RiskClassification[]) {
       
        this._riskClassification = riskClassification;
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
    get allItems(): RiskClassification[] {
        return this._riskClassification.slice();
    }

}

export const RiskClassificationMasterStore = new Store();