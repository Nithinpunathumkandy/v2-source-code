import { action, computed, observable } from "mobx-angular";
import { EventWorkflow, EventWorkflowDetail, EventWorkflowDetails, EventWorkflowHistory, EventWorkflowHistoryPaginationResponse, EventWorkflowPaginationResponse, ModuleGroupsResponse } from "src/app/core/models/event-monitoring/event-workflow/event-workflow";



class Store {

    @observable
    private _eventWorkflowList;

    @observable 
    enabledPopup:string=null;

    @observable
    moduleGroupId: number = null;

    @observable
    from: number = null;

    @observable
    totalItems: number = null;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = '';

    addFlag: boolean = true;

    workflowPopupEnabled: boolean = false;

    @observable
    historyLoaded: boolean = false;

    @observable
    private _eventWorkflowHistory;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    private _eventManagementModules: ModuleGroupsResponse;

    searchText: string;

    @observable 
    loaded:boolean=false;

    @observable 
    individualLoaded:boolean=false;

    @observable
    currentPage: number = 1;

    // @observable
    // private WorkflowTeams: Team[];

    // @observable
    // private WorkflowUser: Users[];

    // @observable
    // private WorkflowDesignation: Designation;

    @observable
    private _eventWorkflow: EventWorkflow[] = [];

    @observable
    private singleEventWorkflow: EventWorkflowDetails;

    @observable
    workflowId: number = null;

    @observable
    levelPopup: string = null;

    @observable
    type: string;

    @observable
    commentForm:boolean=false;

    @action
    setIndividualEventTemplate(res:EventWorkflowDetails){
        
        this.singleEventWorkflow = res;
       
        this.individualLoaded = true;
    }

    @computed
    get EventWorkflowDetails(): EventWorkflowDetails {
        
        return this.singleEventWorkflow
    }

    @action
    setEventWorkflow(response: EventWorkflowPaginationResponse) {
        
        this._eventWorkflow = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unsetIndividualEventTemplate(){
        this.singleEventWorkflow = null;
        this.individualLoaded = false;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setModuleGroups(response: ModuleGroupsResponse) {
        this._eventManagementModules = response;
    }

    @action
    setAllEventTemplate(res: EventWorkflow[]) {
        this._eventWorkflow = res;
        this.loaded = true;  
    }

    @action
    setWorkflowDetails(response: EventWorkflowDetail) {
        this._eventWorkflowList = response;
        this.loaded = true;
    }
    @computed
    get workflowDetails(): EventWorkflowDetail[] {
        return this._eventWorkflowList;
    }

    @computed
    get getModulegroups():ModuleGroupsResponse{
        return this._eventManagementModules;
    }

    @computed
    get allItems(): EventWorkflow[] {
        return this._eventWorkflow.slice();
    }

    @action
    setWorkflowHistory(response: EventWorkflowHistoryPaginationResponse) {
        this._eventWorkflowHistory = response.data;
         this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total; 
        this.historyLoaded = true;
    }
    
    @computed
    get workflowHistoryDetails(): EventWorkflowHistory {
        return this._eventWorkflowHistory;
    }
}

export const EventWorkflowStore = new Store();