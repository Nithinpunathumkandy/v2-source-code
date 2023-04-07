import { action, observable, computed } from "mobx-angular";
import { Designation, MockDrillWorkflow, MockDrillWorkflowPaginationResponse, ModuleGroupsResponse, SingleMockDrillWorkflow, Team, Users } from "src/app/core/models/mock-drill/mock-drill-workflow/mock-drill-workflow";

class store {

    @observable
    enabledPopup: string = null;

    @observable
    moduleGroupId: number = null;

    @observable
    from: number = null;

    @observable
    totalItems: number = null;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'created_at';

    addFlag: boolean = true;

    workflowPopupEnabled: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    private _mockDrillManagementModules: ModuleGroupsResponse;

    searchText: string;

    @observable
    loaded: boolean = false;

    @observable
    individualLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    private WorkflowTeams: Team[];

    @observable
    private WorkflowUser: Users[];

    @observable
    private WorkflowDesignation: Designation;

    @observable
    private _mockDrillWorkflow: MockDrillWorkflow[] = [];

    @observable
    private singleMockDrillWorkflow: SingleMockDrillWorkflow;

    @observable
    workflowId: number = null;

    @observable
    levelPopup: string = null;

    @action
    setIndividualMockDrillTemplate(res) {

        this.singleMockDrillWorkflow = res;
        res.workflow_items.forEach(element => {
            if (element.type == "team") {
                this.WorkflowTeams = element.team;
                this.WorkflowTeams.forEach(res => {
                    res.level = element.level
                    res.level_id = element.id
                })
            }
            if (element.type == "user") {
                this.WorkflowUser = element.user;
            }
            if (element.type == "designation") {
                this.WorkflowDesignation = element.designation;
            }
        });
        this.individualLoaded = true;
    }

    @computed
    get mockDrillWorkflowDetails(): SingleMockDrillWorkflow {

        return this.singleMockDrillWorkflow
    }

    unSetIndividualMockDrillTemplate() {
        this.individualLoaded = false;
        this.singleMockDrillWorkflow = null;
    }

    @action
    setMockDrillWorkflow(response: MockDrillWorkflowPaginationResponse) {

        this._mockDrillWorkflow = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unsetMockDrillWorkflow() {
        this._mockDrillWorkflow = [];
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
        this._mockDrillManagementModules = response;
    }

    @action
    setAllMockDrillTemplate(response: MockDrillWorkflowPaginationResponse) {
        this._mockDrillWorkflow = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @computed
    get getModulegroups(): ModuleGroupsResponse {
        return this._mockDrillManagementModules;
    }

    @computed
    get allItems(): MockDrillWorkflow[] {
        return this._mockDrillWorkflow.slice();
    }

}
export const MockDrillWorkflowStore = new store();