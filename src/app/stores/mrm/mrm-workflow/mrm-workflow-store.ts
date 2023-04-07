import { action, observable, computed } from "mobx-angular";
import { Designation, ModuleGroupsResponse, MrmWorkflow, MrmWorkflowPaginationResponse, SingleMrmWorkflow, Team, Users } from "src/app/core/models/mrm/mrm-workflow/mrm-workflow";

class store{

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
    private _mrmManagementModules: ModuleGroupsResponse;

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
    private _mrmWorkflow: MrmWorkflow[] = [];

    @observable
    private singleMrmWorkflow: SingleMrmWorkflow;

    @observable
    workflowId: number = null;

    @observable
    levelPopup: string = null;

    @action
    setIndividualMrmTemplate(res){
        
        this.singleMrmWorkflow = res;
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
    get mrmWorkflowDetails(): SingleMrmWorkflow {
        
        return this.singleMrmWorkflow
    }

    unSetIndividualMrmTemplate(){
        this.individualLoaded = false;
        this.singleMrmWorkflow = null;
    }

    @action
    setMrmWorkflow(response: MrmWorkflowPaginationResponse) {
        
        this._mrmWorkflow = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unsetMrmWorkflow() {
        this._mrmWorkflow = [];
        this.currentPage = null;
        this.itemsPerPage = null;
        this.totalItems = null;
        this.from = null;
        this.loaded = false;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setModuleGroups(response: ModuleGroupsResponse) {
        this._mrmManagementModules = response;
    }

    @action
    setAllMrmTemplate(response: MrmWorkflowPaginationResponse) {
        this._mrmWorkflow = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @computed
    get getModulegroups():ModuleGroupsResponse{
        return this._mrmManagementModules;
    }

    @computed
    get allItems(): MrmWorkflow[] {
        return this._mrmWorkflow.slice();
    }

}
export const MrmWorkflowStore = new store();