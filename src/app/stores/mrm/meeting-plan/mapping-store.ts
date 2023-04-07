import { observable, action, computed } from "mobx-angular";
import { Mapping, MappingPaginationResponse } from 'src/app/core/models/mrm/meeting-plan/mapping';
class Store {
    @observable
    private _mappingList;

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    orderItem: string = 'title';

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
    processes_select_form_modal: boolean = false;

    @observable
    issue_select_form_modal: boolean = false;

    @observable
    risk_select_form_modal: boolean = false;

    @observable
    control_select_form_modal: boolean = false;

    @observable
    saveSelected: boolean=false;

  
    @action
    setMappingDetails(response: Mapping) {
        this._mappingList = response;
        this.loaded = true;
    }

    @action
    unsetMappingDetails() {
        this._mappingList = null;
        this.saveSelected =false
        this.loaded = false;
    }


    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @computed
    get mappingDetails(): Mapping {
        return this._mappingList;
    }

}

export const MappingStore = new Store();