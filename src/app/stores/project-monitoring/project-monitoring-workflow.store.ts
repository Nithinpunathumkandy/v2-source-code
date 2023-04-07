import { action, observable, computed } from "mobx-angular";
import { ModuleGroupsResponse, Team, Users, ProjectWorkflow, SingleProjectWorkflow, ProjectWorkflowPaginationResponse } from "src/app/core/models/project-monitoring/project-monitoring-workflow.modal";
import { Designation } from "../../core/models/masters/human-capital/designation"

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
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    private _strategyManagementModules: ModuleGroupsResponse;

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
    private _projectWorkflow: ProjectWorkflow[] = [];

    @observable
    private singleProjectWorkflow: SingleProjectWorkflow;

    @observable
    workflowId: number = null;

    @observable
    levelPopup: string = null;

    @action
    setIndividualRiskTemplate(res){        
        this.singleProjectWorkflow = res;
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

    @computed
    get ProjectWorkflowDetails(): SingleProjectWorkflow {        
        return this.singleProjectWorkflow
    }

    @action
    unsetIndividualWorkflow(){
        this.individualLoaded=false
        this.singleProjectWorkflow=null
    }

    @action
    setProjectWorkflow(response: ProjectWorkflowPaginationResponse) {        
        this._projectWorkflow = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unsetProjectWorkflow(){
        this._projectWorkflow = null
        this.loaded=false
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setModuleGroups(response: ModuleGroupsResponse) {
        this._strategyManagementModules = response;
    }

    @action
    setAllRiskTemplate(res: ProjectWorkflow[]) {
        this._projectWorkflow = res;
        this.loaded = true;  
    }

    @computed
    get getModulegroups():ModuleGroupsResponse{
        return this._strategyManagementModules;
    }

    @computed
    get allItems(): ProjectWorkflow[] {
        return this._projectWorkflow.slice();
    }
}
export const ProjectMonitoringWorkflowStore = new Store();