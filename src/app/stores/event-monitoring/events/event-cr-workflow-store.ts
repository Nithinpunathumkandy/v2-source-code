import { observable, action, computed } from "mobx-angular";

class Store {
    
    @observable
    private _eventChangeRequestWorkflow: any = [];

    @observable
    loaded: boolean = false;

    @action
    setEventChangeRequestWorkflow(workflowItems){
        this._eventChangeRequestWorkflow = workflowItems;
        this.loaded = true;
    }

    @computed
    get eventChangeRequestWorkflow(){
        return this._eventChangeRequestWorkflow;
    }

    @observable
    crWorkflowHistory: any[] = [];

    @observable
    workflowHistoryPage: number = 1;

    @observable
    workflowHistoryLoaded: boolean = false;

    @observable
    workflowType: string;

    @observable
    workflowItemsPerPage: number = null;

    @observable
    workflowTotalItems: number = null;

    @action
    setChangeRequestWorkflowHistory(history: any){
        this.crWorkflowHistory = history.data;
        this.workflowHistoryPage = history.current_page;
        this.workflowItemsPerPage = history.per_page;
        this.workflowTotalItems = history.total;
        this.workflowHistoryLoaded = true;
    }

}
export const EventChangeRequestWorkflowStore = new Store();
