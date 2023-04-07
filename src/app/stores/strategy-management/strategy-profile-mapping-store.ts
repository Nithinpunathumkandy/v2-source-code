import { observable, action, computed } from "mobx-angular";
class Store {
    @observable
    private _strategyProfileMappingList;

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    orderItem: string = 'strategy-Profile-title';

    @observable
    individual_strategy_profile_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    strategyProfileId: number = null;

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
    assets=[];

    @observable
    trainings=[];

    @observable
    controls=[];

    @observable
    customers=[];

    @observable
    objectives=[];

    @observable
    selectedTrainingList = [];

    @observable
    training_select_form_modal: boolean = false;

    @observable
    selectedRiskList = [];

    @observable
    risk_select_form_modal: boolean = false;

    @observable
    selectedDocumentList = [];

    @observable
    selectedProjectManagementList = [];

    @observable
    selectedProjectMonitoringList = [];

    @observable
    selectedIncidentList = [];

    @observable
    document_select_form_modal: boolean = false;

    @observable
    selectedAuditFindingList = [];

    @observable
    audit_finding_select_form_modal: boolean = false;

    @observable
    selectedAssetList = [];

    @observable
    asset_select_form_modal: boolean = false;

    @action
    setStrategyProfileMappingDetails(response) {
        this._strategyProfileMappingList = response; 
        this.loaded = true;
        //this.updateUserJob(response.data);
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @computed
    get strategyProfileMappingDetails() {

        return this._strategyProfileMappingList;
    }
}

export const StrategyProfileMappingStore = new Store();