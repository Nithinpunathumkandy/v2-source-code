import { action, observable, computed } from "mobx-angular";
import { Designation, ModuleGroupsResponse, HiraWorkflow, HiraWorkflowPaginationResponse, SingleHiraWorkflow, Team, Users } from "src/app/core/models/hira/workflow/hira-workflow";

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
    private _hiraManagementModules: ModuleGroupsResponse;

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
    private _hiraWorkflow: HiraWorkflow[] = [];

    @observable
    private singleHiraWorkflow: SingleHiraWorkflow;

    @observable
    workflowId: number = null;

    @observable
    levelPopup: string = null;

    @action
    setIndividualHiraTemplate(res){
        
        this.singleHiraWorkflow = res;
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
    unsetIndividualHiraTemplate(){
        this.singleHiraWorkflow = null;
        this.individualLoaded = false;
    }

    @computed
    get hiraWorkflowDetails(): SingleHiraWorkflow {
        
        return this.singleHiraWorkflow
    }

    @action
    setHiraWorkflow(response: HiraWorkflowPaginationResponse) {
        
        this._hiraWorkflow = response.data;
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
        this._hiraManagementModules = response;
    }

    @action
    setAllHiraTemplate(res: HiraWorkflow[]) {
        this._hiraWorkflow = res;
        this.loaded = true;  
    }

    @computed
    get getModulegroups():ModuleGroupsResponse{
        return this._hiraManagementModules;
    }

    @computed
    get allItems(): HiraWorkflow[] {
        return this._hiraWorkflow.slice();
    }
}

export const HiraWorkflowStore = new Store();