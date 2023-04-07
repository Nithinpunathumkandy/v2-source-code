import { observable, action, computed } from "mobx-angular";
import { ContractMapping } from 'src/app/core/models/compliance-management/compliance-mapping/compliance-mapping';
class Store {
    @observable
    private _mappingList;

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    orderItem: string = 'title';

    @observable
    individual_contract_loaded: boolean = false;

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
    processes_select_form_modal: boolean = false;

    @observable
    issue_select_form_modal: boolean = false;

    @observable
    risk_select_form_modal: boolean = false;

    @observable
    control_select_form_modal: boolean = false;

    @observable
    saveSelected: boolean=false;

    @observable
    mappingIssueItemsLoaded:boolean=false

  
    @action
    setSLAContractMappingDetails(response: ContractMapping) {
        this._mappingList = response;
        this.loaded = true;
        this.mappingIssueItemsLoaded=true
    }

    @action
    unsetSLAContractMappingDetails() {
        this._mappingList = null;
        this.loaded = false;
    }


    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @computed
    get mappingItemList(): ContractMapping {
        return this._mappingList;
    }

}

export const SLAContractMappingStore = new Store();