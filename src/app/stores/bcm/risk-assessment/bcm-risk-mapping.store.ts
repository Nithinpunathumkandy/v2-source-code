import { observable, action, computed } from "mobx-angular";
// import { Project } from "src/app/core/models/project-management/projects";
import { RiskMapping, RiskMappingPaginationResponse } from 'src/app/core/models/risk-management/risks/risk-mapping';
class Store {
    @observable
    private _riskMappingList;

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

    @observable
    projects=[];
    
    @observable
    locations=[];

    @observable
    products=[];

    @observable
    controls=[];

    @observable
    customers=[];

    @observable
    objectives=[];

    @observable
    focusAreas=[];

    @observable
    assets=[];

  
    @action
    setRiskMappingDetails(response: RiskMapping) {
        this._riskMappingList = response;
        
        this.loaded = true;
        //this.updateUserJob(response.data);
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

  


    @computed
    get riskMappingDetails(): RiskMapping {

        return this._riskMappingList;
    }

   


}

export const BcmRiskMappingStore = new Store();