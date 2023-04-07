import { action, computed, observable } from "mobx-angular";
import { ImpactScenario, ImpactScenarioPaginationResponse, IndividualImpactScenario } from "src/app/core/models/bcm/impact-scenario/impact-scenario";


class Store{
    @observable
    private _impactScenarioList: ImpactScenario[] = [];

    @observable
    private _impactScenarioDetails:IndividualImpactScenario;

    @observable
    lastInsertedId: number = null;

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'bia_impact_scenarios.created_at';


    // @observable
    // individual_impact_scenario_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    selected: number = null;

    @observable
    searchText: string;

    @action
    setImpactScenarioDetails(response: ImpactScenarioPaginationResponse) {
        this._impactScenarioList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        
    }

    @action
    unsetImpactScenarioDetails() {
        this._impactScenarioList = [];
        this.loaded = false;   
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @computed
    get ImpactScenarioDetails(): ImpactScenario[] {

        return this._impactScenarioList.slice();
    }

    @action
    setIndividualImpactScenario(details:IndividualImpactScenario) {
     
        this._impactScenarioDetails=details;
    }

    unsetIndividualImpactScenario(){
  
        this._impactScenarioDetails = null;
    }

    @computed
    get IndivitualImpactScenarioDetails(): IndividualImpactScenario {
    return this._impactScenarioDetails;
    }
 
}

export const ImpactScenarioStore = new Store()