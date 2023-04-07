import { action, observable, computed } from "mobx-angular";
import { Designation, ModuleGroupsResponse, RiskWorkflow, RiskWorkflowPaginationResponse, SingleRiskWorkflow, Team, Users } from "src/app/core/models/risk-management/risk-workflow/risk-workflow";

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
    private _riskManagementModules: ModuleGroupsResponse;

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
    private _riskWorkflow: RiskWorkflow[] = [];

    @observable
    private singleRiskWorkflow: SingleRiskWorkflow;

    @observable
    workflowId: number = null;

    @observable
    levelPopup: string = null;

    @action
    setIndividualRiskTemplate(res){
        
        this.singleRiskWorkflow = res;
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
    unsetIndividualRiskTemplate(){
        this.singleRiskWorkflow = null;
        this.individualLoaded = false;
    }

    @computed
    get riskWorkflowDetails(): SingleRiskWorkflow {
        
        return this.singleRiskWorkflow
    }

    @action
    setRiskWorkflow(response: RiskWorkflowPaginationResponse) {
        
        this._riskWorkflow = response.data;
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
        this._riskManagementModules = response;
    }

    @action
    setAllRiskTemplate(res: RiskWorkflow[]) {
        this._riskWorkflow = res;
        this.loaded = true;  
    }

    @computed
    get getModulegroups():ModuleGroupsResponse{
        return this._riskManagementModules;
    }

    @computed
    get allItems(): RiskWorkflow[] {
        return this._riskWorkflow.slice();
    }
}

export const RiskWorkflowStore = new Store();