import { observable, action, computed } from "mobx-angular";
import { RiskScore } from 'src/app/core/models/risk-management/risk-configuration/risk-score';
import { RiskMapping, RiskMappingPaginationResponse } from 'src/app/core/models/risk-management/risks/risk-mapping';
class Store {
    @observable
    private _riskScoreList;

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    orderItem: string = 'risk-title';

    // @observable
    // private _individualRiskDetails: IndividualRisk;

    @observable
    individual_risk_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    riskId: number = null;


    @observable
    selected: number = null;

    @observable
    searchText: string;

  
    @action
  
    @action
    setRiskScoreDetails(response) {
        this._riskScoreList = response;
        // this.currentPage = response.current_page;
        // this.itemsPerPage = response.per_page;
        // this.totalItems = response.total;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

  


    @computed
    get riskScoreDetails() {

        return this._riskScoreList;
    }

   


}

export const IsmsRiskScoreStore = new Store();