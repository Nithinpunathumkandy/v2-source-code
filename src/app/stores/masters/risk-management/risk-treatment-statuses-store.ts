import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { RiskTreatmentStatuses,RiskTreatmentStatusesPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-treatment-statuses';

class Store {
    @observable
    private _riskTreatmentStatuses: RiskTreatmentStatuses[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualLoaded: boolean = false;

    @observable
    individualRiskTreatmentStatuses: RiskTreatmentStatuses;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    lastInsertedId: number = null;

    @observable
    orderItem: string = 'risk_treatment_statuses_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setRiskTreatmentStatuses(response: RiskTreatmentStatusesPaginationResponse) {
        
        this._riskTreatmentStatuses = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllRiskTreatmentStatuses(risktType: RiskTreatmentStatuses[]) {
       
        this._riskTreatmentStatuses = risktType;
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

    @action
    setIndividualRiskTreatmentStatuses(riskTreatmentStatuses: RiskTreatmentStatuses) {
       
        this.individualRiskTreatmentStatuses = riskTreatmentStatuses;
        this.individualLoaded = true;
        
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }


    @computed
    get allItems(): RiskTreatmentStatuses[] {
        return this._riskTreatmentStatuses.slice();
    }

}

export const RiskTreatmentStatusesMasterStore = new Store();