import { action, observable, computed } from "mobx-angular";
import { AuditWorkflow, AuditWorkflowPaginationResponse, InternalAuditModules, ModuleGroups, ModuleGroupsResponse, SingleAuditWorkflow, Team, UserTypes, UserTypesResponse, Users, Designation } from "src/app/core/models/internal-audit/audit-workflow/audit-workflow";

class Store{

    @observable 
    loaded:boolean=false;

    @observable 
    enabledPopup:string=null;

    addFlag: boolean = true;

    @observable
    from: number = null;

    @observable
    totalItems: number = null;

    @observable
    itemsPerPage: number = null;

    @observable
    workflowId: number = null;

    @observable
    levelPopup: string = null;

    @observable
    moduleGroupId: number = null;

    workflowPopupEnabled: boolean = false;

    @observable
    private _auditWorkflow: AuditWorkflow[] = [];

    @observable
    private _auditWorkflowUserTypes: UserTypesResponse[] = [];

    @observable
    private singleAuditWorkflow: SingleAuditWorkflow;

    @observable
    private WorkflowTeams: Team[];

    @observable
    private WorkflowUser: Users[];

    @observable
    private WorkflowDesignation: Designation;

    @observable
    private _moduleGroups: ModuleGroups;

    @observable
    private _moduleResponse: ModuleGroupsResponse;

    @observable
    private _internalAuditModules: ModuleGroupsResponse;

    @observable
    private _auditModules: InternalAuditModules;

    @observable 
    individualLoaded:boolean=false;

    @observable
    orderItem: string = '';

    @observable
    currentPage: number = 1;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';
    
    searchText: string;

    @action
    setUserTypes(response: UserTypes) {
        this._auditWorkflowUserTypes = response.data;
    }

    @computed
    get userTypes(): UserTypesResponse[] {
        
        return this._auditWorkflowUserTypes.slice();
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
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
    setAllAuditTemplate(res: AuditWorkflow[]) {
       
        this._auditWorkflow = res;
        this.loaded = true;
        
    }

    @action
    setModuleGroups(response: ModuleGroupsResponse) {
        this._internalAuditModules = response;
    }
    @computed
    get getModulegroups():ModuleGroupsResponse{
        return this._internalAuditModules;
    }

    @computed
    get allItems(): AuditWorkflow[] {
        
        return this._auditWorkflow;
    }

    @action
    unsetIndividualWorkflow(){
        this.individualLoaded=false
        this.singleAuditWorkflow=null
    }

    @action
    setIndividualAuditTemplate(res){
        
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
                // this.WorkflowUser.level_id = element.id;
                // this.WorkflowUser.level = element.level;
            }
            if(element.type=="designation"){
                this.WorkflowDesignation = element.designation;
                // this.WorkflowDesignation.level = element.level;
            }
        });
        this.individualLoaded = true;
    }

    @computed
    get auditWorkflowDetails(): SingleAuditWorkflow {
        
        return this.singleAuditWorkflow
    }

    @computed
    get WorkflowTeam(): Team[] {
        
        return this.WorkflowTeams
    }

    @computed
    get WorkflowUsers(): Users[] {
        
        return this.WorkflowUser
    }

    @computed
    get WorkflowDesignations(): Designation {
        
        return this.WorkflowDesignation
    }
}


export const AuditWorkflowStore = new Store();