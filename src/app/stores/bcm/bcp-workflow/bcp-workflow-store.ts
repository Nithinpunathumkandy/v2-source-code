import { action, observable, computed } from "mobx-angular";
import { BcpWorkflow, BcpWorkflowPaginationResponse, Designation, ModuleGroupsResponse, SingleBcpWorkflow, Team, Users } from "src/app/core/models/bcm/bcm-workflow/bcm-workflow";

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
    private _bcmManagementModules: ModuleGroupsResponse;

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
    private _bcpWorkflow: BcpWorkflow[] = [];

    @observable
    private singleBcpWorkflow: SingleBcpWorkflow;

    @observable
    workflowId: number = null;

    @observable
    levelPopup: string = null;

    @action
    setIndividualRiskTemplate(res){
        
        this.singleBcpWorkflow = res;
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
        this.singleBcpWorkflow = null;
        this.individualLoaded = false;
    }

    @computed
    get BcpWorkflowDetails(): SingleBcpWorkflow {
        
        return this.singleBcpWorkflow
    }

    @action
    setBcpWorkflow(response: BcpWorkflowPaginationResponse) {
        
        this._bcpWorkflow = response.data;
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
        this._bcmManagementModules = response;
    }

    @action
    setAllRiskTemplate(res: BcpWorkflow[]) {
        this._bcpWorkflow = res;
        this.loaded = true;  
    }

    @computed
    get getModulegroups():ModuleGroupsResponse{
        return this._bcmManagementModules;
    }

    @computed
    get allItems(): BcpWorkflow[] {
        return this._bcpWorkflow.slice();
    }
}

export const BcpWorkflowStore = new Store();