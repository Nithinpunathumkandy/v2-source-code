import { action, observable, computed } from "mobx-angular";

class Store {

    // @action
    // setWorkflowDetails(response) {
    //     this._projectWorkflowList = response;
    //     this.loaded = true;
    // }
    // @computed
    // get workflowDetails(){
    //     return this._projectWorkflowList;
    // }
}

export const StrategyScoreStore = new Store();