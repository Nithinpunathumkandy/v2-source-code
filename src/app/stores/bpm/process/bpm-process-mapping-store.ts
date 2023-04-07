import { observable, action, computed } from "mobx-angular";
import { BpmProcessMapping } from "src/app/core/models/bpm/process/bpm-process-mapping";
class Store {
    @observable
    private _mappingList: BpmProcessMapping;

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    orderItem: string = 'title';

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
    setBpmProcessMapingDetails(response: BpmProcessMapping) {
        this._mappingList = response;
        this.loaded = true;
    }

    @action
    unsetBpmProcessMapingDetails() {
        this._mappingList = null;
        this.loaded = false;
    }


    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @computed
    get mappingItemList(): BpmProcessMapping {
        return this._mappingList;
    }

}

export const BpmProcessMappingStore = new Store();