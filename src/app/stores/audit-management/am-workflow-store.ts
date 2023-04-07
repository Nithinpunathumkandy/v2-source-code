import { action, observable, computed } from "mobx-angular";
import { Designation, ModuleGroupsResponse, AmWorkflow, AmWorkflowPaginationResponse, SingleAmWorkflow, Team, Users } from "src/app/core/models/audit-management/am-workflow/am-workflow";

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
    private _auditManagementModules: ModuleGroupsResponse;

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
    private _amWorkflow: AmWorkflow[] = [];

    @observable
    private singleAmWorkflow: SingleAmWorkflow;

    @observable
    workflowId: number = null;

    @observable
    levelPopup: string = null;

    @action
    setIndividualAmTemplate(res){
        
        this.singleAmWorkflow = res;
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
    unsetIndividualAmTemplate(){
        this.singleAmWorkflow = null;
        this.individualLoaded = false;
    }

    @computed
    get amWorkflowDetails(): SingleAmWorkflow {
        
        return this.singleAmWorkflow
    }

    @action
    setAmWorkflow(response: AmWorkflowPaginationResponse) {
        
        this._amWorkflow = response.data;
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
        this._auditManagementModules = response;
    }

    @action
    setAllAmTemplate(res: AmWorkflow[]) {
        this._amWorkflow = res;
        this.loaded = true;  
    }

    @computed
    get getModulegroups():ModuleGroupsResponse{
        return this._auditManagementModules;
    }

    @computed
    get allItems(): AmWorkflow[] {
        return this._amWorkflow.slice();
    }
}

export const AmWorkflowStore = new Store();