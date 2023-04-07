import { observable, action, computed } from "mobx-angular";
import { HiraScore } from 'src/app/core/models/hira/hira-configuration/hira-score';

class Store {
    @observable
    private _hiraScoreList;

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    orderItem: string = 'hira-title';

    // @observable
    // private _individualhiraDetails: Individualhira;

    @observable
    individual_hira_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    hiraId: number = null;


    @observable
    selected: number = null;

    @observable
    searchText: string;

  
    @action
  
    @action
    sethiraScoreDetails(response) {
        this._hiraScoreList = response;
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
    get hiraScoreDetails(): HiraScore {

        return this._hiraScoreList;
    }

   


}

export const HiraScoreStore = new Store();