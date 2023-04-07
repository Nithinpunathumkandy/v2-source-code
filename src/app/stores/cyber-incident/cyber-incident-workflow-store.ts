import { action, observable, computed } from "mobx-angular";
import { CIWorkflow, CIWorkflowPaginationResponse, ModuleGroupsResponse, SingleCIWorkflow, Team, Users } from "src/app/core/models/cyber-incident/cyber-incident-workflow-modal";
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
    private _cyberIncidentModules: ModuleGroupsResponse;

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
    private _cyberIncidentWorkflow: CIWorkflow[] = [];

    @observable
    private singleCyberIncidentWorkflow: SingleCIWorkflow;

    @observable
    workflowId: number = null;

    @observable
    levelPopup: string = null;

    @action
    setIndividualRiskTemplate(res){        
        this.singleCyberIncidentWorkflow = res;
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
    get CyberIncidentWorkflowDetails(): SingleCIWorkflow {        
        return this.singleCyberIncidentWorkflow
    }

    @action
    unsetIndividualWorkflow(){
        this.individualLoaded=false
        this.singleCyberIncidentWorkflow=null
    }

    @action
    setCyberIncidentWorkflow(response: CIWorkflowPaginationResponse) {        
        this._cyberIncidentWorkflow = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unsetCyberIncidentWorkflow(){
        this._cyberIncidentWorkflow = null
        this.loaded=false
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setModuleGroups(response: ModuleGroupsResponse) {
        this._cyberIncidentModules = response;
    }

    @action
    setAllRiskTemplate(res: CIWorkflow[]) {
        this._cyberIncidentWorkflow = res;
        this.loaded = true;  
    }

    @computed
    get getModulegroups():ModuleGroupsResponse{
        return this._cyberIncidentModules;
    }

    @computed
    get allItems(): CIWorkflow[] {
        return this._cyberIncidentWorkflow.slice();
    }
}
export const CyberIncidentWorkflowStore = new Store();