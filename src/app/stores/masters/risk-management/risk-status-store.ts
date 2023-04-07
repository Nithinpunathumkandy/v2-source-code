import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { RiskStatus,RiskStatusPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-status';

class Store {
    @observable
    private _riskStatus: RiskStatus[] = [];

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
    orderItem: string = 'risk_status_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setRiskStatus(response: RiskStatusPaginationResponse) {
        
        this._riskStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllRiskStatus(status: RiskStatus[]) {
       
        this._riskStatus = status;
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
    get allItems(): RiskStatus[] {
        return this._riskStatus.slice();
    }

}

export const RiskStatusMasterStore = new Store();