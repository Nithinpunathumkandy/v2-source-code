import { action, observable, computed } from "mobx-angular";
import { Designation, ModuleGroupsResponse, IncidentWorkflow, IncidentWorkflowPaginationResponse, SingleIncidentWorkflow, Team, Users } from "src/app/core/models/incident-management/incident-workflow/incident-workflow";

class Store {

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
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    private _incidentManagementModules: ModuleGroupsResponse;

    searchText: string;

    @observable 
    loaded:boolean=false;

    @observable 
    individualLoaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    private WorkflowTeams: Team[];

    @observable
    private WorkflowUser: Users[];

    @observable
    private WorkflowDesignation: Designation;

    @observable
    private _incidentWorkflow: IncidentWorkflow[] = [];

    @observable
    private singleIncidentWorkflow: SingleIncidentWorkflow;

    @observable
    workflowId: number = null;

    @observable
    levelPopup: string = null;

    @action
    setIndividualIncidentTemplate(res){
        
        this.singleIncidentWorkflow = res;
        res.workflow_items.forEach(element => {
            if(element.type=="team"){
                this.WorkflowTeams = element.team;
                this.WorkflowTeams.forEach(res=>{
                    res.level = element.level
                    res.level_id = element.id
                })
            }
            if(element.type=="user"){
                this.WorkflowUser=element.user;
            }
            if(element.type=="designation"){
                this.WorkflowDesignation = element.designation;
            }
        });
        this.individualLoaded = true;
    }

    @action
    unsetIndividualIncidentTemplate(){
        this.singleIncidentWorkflow = null;
        this.individualLoaded = false;
        this.WorkflowTeams = [];
        this.WorkflowUser = [];
        this.WorkflowDesignation = null;
    }

    @computed
    get incidentWorkflowDetails(): SingleIncidentWorkflow {
        
        return this.singleIncidentWorkflow
    }

    @action
    setIncidentWorkflow(response: IncidentWorkflowPaginationResponse) {
        
        this._incidentWorkflow = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setModuleGroups(response: ModuleGroupsResponse) {
        this._incidentManagementModules = response;
    }

    @action
    setAllIncidentTemplate(res: IncidentWorkflow[]) {
        this._incidentWorkflow = res;
        this.loaded = true;  
    }

    @computed
    get getModulegroups():ModuleGroupsResponse{
        return this._incidentManagementModules;
    }

    @computed
    get allItems(): IncidentWorkflow[] {
        return this._incidentWorkflow.slice();
    }
}

export const IncidentWorkflowStore = new Store();