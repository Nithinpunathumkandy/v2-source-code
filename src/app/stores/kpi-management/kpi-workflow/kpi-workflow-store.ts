import { action, observable, computed } from "mobx-angular";
import { Designation, KpiWorkflow, KpiWorkflowPaginationResponse, ModuleGroupsResponse, SingleKpiWorkflow, Team, Users } from "src/app/core/models/kpi-management/kpi-workflow/kpi-workflow";

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
    private _kpiManagementModules: ModuleGroupsResponse;

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
    private _kpiWorkflow: KpiWorkflow[] = [];

    @observable
    private singleKpiWorkflow: SingleKpiWorkflow;

    @observable
    workflowId: number = null;

    @observable
    levelPopup: string = null;

    @action
    setIndividualKpiTemplate(res){
        
        this.singleKpiWorkflow = res;
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
    get kpiWorkflowDetails(): SingleKpiWorkflow {
        
        return this.singleKpiWorkflow;
    }

    unSetIndividualKpiTemplate(){
        this.individualLoaded = false;
        this.singleKpiWorkflow = null;
    }

    @action
    setKpiWorkflow(response: KpiWorkflowPaginationResponse) {
        
        this._kpiWorkflow = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unsetKpiWorkflow() {
        this._kpiWorkflow = [];
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
        this._kpiManagementModules = response;
    }

    @action
    setAllKpiTemplate(response: KpiWorkflowPaginationResponse) {
        this._kpiWorkflow = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @computed
    get getModulegroups():ModuleGroupsResponse{
        return this._kpiManagementModules;
    }

    @computed
    get allItems(): KpiWorkflow[] {
        return this._kpiWorkflow.slice();
    }

}
export const KpiWorkflowStore = new store();