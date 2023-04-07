import { action, observable, computed } from "mobx-angular";
import { ComplianceWorkflow, ComplianceWorkflowDetails, ComplianceWorkflowPaginationResponse, ModuleGroupsResponse, Team, Users } from "src/app/core/models/compliance-management/compliance-workflow/compliance-workflow";

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
    private _ComplianceManagementModules: ModuleGroupsResponse;

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
    private _ComplianceWorkflow: ComplianceWorkflow[] = [];

    @observable
    private singleComplianceWorkflow: ComplianceWorkflowDetails;

    @observable
    workflowId: number = null;

    @observable
    levelPopup: string = null;

    @action
    setIndividualComplianceTemplate(res:ComplianceWorkflowDetails){
        
        this.singleComplianceWorkflow = res;
        // res.workflow_items.forEach(element => {
        //     if(element.type=="team"){
        //         this.WorkflowTeams = element.team;
        //         this.WorkflowTeams.forEach(res=>{
        //             res.level = element.level
        //             res.level_id = element.id
        //         })
        //     }
        //     if(element.type=="user"){
        //         this.WorkflowUser=element.user;
        //     }
        //     if(element.type=="designation"){
        //         this.WorkflowDesignation = element.designation;
        //     }
        // });
        this.individualLoaded = true;
    }

    @computed
    get ComplianceWorkflowDetails(): ComplianceWorkflowDetails {
        
        return this.singleComplianceWorkflow
    }

    @action
    setComplianceWorkflow(response: ComplianceWorkflowPaginationResponse) {
        
        this._ComplianceWorkflow = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unsetIndividualComplianceTemplate(){
        this.singleComplianceWorkflow = null;
        this.individualLoaded = false;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setModuleGroups(response: ModuleGroupsResponse) {
        this._ComplianceManagementModules = response;
    }

    @action
    setAllComplianceTemplate(res: ComplianceWorkflow[]) {
        this._ComplianceWorkflow = res;
        this.loaded = true;  
    }

    @computed
    get getModulegroups():ModuleGroupsResponse{
        return this._ComplianceManagementModules;
    }

    @computed
    get allItems(): ComplianceWorkflow[] {
        return this._ComplianceWorkflow.slice();
    }
}

export const ComplianceWorkflowStore = new Store();