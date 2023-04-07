import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { RiskType,RiskTypePaginationResponse } from 'src/app/core/models/masters/risk-management/risk-type';

class Store {
    @observable
    private _riskType: RiskType[] = [];

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
    orderItem: string = 'risk_type_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setRiskType(response: RiskTypePaginationResponse) {
        
        this._riskType = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllRiskType(risktType: RiskType[]) {
       
        this._riskType = risktType;
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
    get allItems(): RiskType[] {
        return this._riskType.slice();
    }

}

export const RiskTypeMasterStore = new Store();