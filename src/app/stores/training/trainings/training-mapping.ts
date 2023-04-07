import { observable, action, computed } from "mobx-angular";
import { TrainingMapping } from "src/app/core/models/training/trainings/training-mapping";

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
    individual_compliance_loaded: boolean = false;

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
    saveSelected: boolean=false;

    @action
    setTrainingMappingDetails(response: TrainingMapping) {
        this._mappingList = response;
        this.loaded = true;
        
    }

    @action
    unsetTrainingMappingDetails() {
        this._mappingList = null;
        this.loaded = false;
    }


    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @computed
    get mappingItemList(): TrainingMapping {
        return this._mappingList;
    }

}

export const TrainingMappingStore = new Store();