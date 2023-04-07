import { action, observable, computed } from "mobx-angular";
import { Designation } from "src/app/core/models/human-capital/users/users";
import { ModuleGroupsResponse, Team ,AuditWorkflow, SingleAuditWorkflow, Users,AuditWorkflowPaginationResponse } from "src/app/core/models/ms-audit-management/ms-audit/audit-workflow/audit-workflow";

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
    private _auditWorkflow: AuditWorkflow[] = [];

    @observable
    private singleAuditWorkflow: SingleAuditWorkflow;

    @observable
    workflowId: number = null;

    @observable
    levelPopup: string = null;

    @action
    setIndividualRiskTemplate(res){        
        this.singleAuditWorkflow = res;
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
    get auditWorkflowDetails(): SingleAuditWorkflow {        
        return this.singleAuditWorkflow
    }

    @action
    unsetIndividualWorkflow(){
        this.individualLoaded=false
        this.singleAuditWorkflow=null
    }

    @action
    setAuditWorkflow(response: AuditWorkflowPaginationResponse) {        
        this._auditWorkflow = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unsetProjectWorkflow(){
        this._auditWorkflow = null
        this.loaded=false
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
    setAllAuditTemplate(res: AuditWorkflow[]) {
        this._auditWorkflow = res;
        this.loaded = true;  
    }

    @computed
    get getModulegroups():ModuleGroupsResponse{
        return this._auditManagementModules;
    }

    @computed
    get allItems(): AuditWorkflow[] {
        return this._auditWorkflow.slice();
    }
}
export const MsAuditWorkflowStore = new Store();