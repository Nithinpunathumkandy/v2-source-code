import { action, computed, observable } from "mobx-angular";
import { Bcp, BcpDetails, BcpPaginationResponse, BcpVersions, BcpWorkFlowDetails, BcpWorkflowHistory, WorkFlowHistoryPaginationResponse } from "src/app/core/models/bcm/bcp/bcp";

class Store{
    @observable
    private _bcpList: Bcp[] = [];

    @observable
    private _bcpDetails:BcpDetails;

    @observable
    private _bcpContents: any;

    @observable
    bcpSearchItem: any[] = [];

    bcpContentsStringified: any;

    @observable
    lastInsertedId: number = null;

    @observable
    loaded: boolean = false;

    @observable
    detailsLoaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'business_continuity_plans.created_at';

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    selected: number = null;

    @observable
    searchText: string;

    @observable
    currentVersionId:number = null;

    @observable
    bcpWorkflow: BcpWorkFlowDetails[] = [];

    @observable
    selectedBcpId: number = null;

    @observable
    bcpVersionHistory: BcpVersions[];

    filtersearchText: string;

    @observable
    selectedStatusCategory: string = 'all';

    @action
    setBcpResponse(response: BcpPaginationResponse) {
        this._bcpList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
    }

    @action
    unsetBcpList() {
        this._bcpList = [];
        this.loaded = false;  
        BcpStore.selectedStatusCategory = 'all';
    }

    @action
    setSearchList(res){
        this.bcpSearchItem = res;
    }

    @action
    setBcpDetails(bcpDetails: BcpDetails){
        this._bcpDetails = bcpDetails;
        this.detailsLoaded = true;
    }

    @action
    unsetBcpDetails(){
        this._bcpDetails = null;
        this.detailsLoaded = false;
        this._bcpContents = null;
        this.workflowHistoryLoaded = false;
        this.workflowLoaded = false;
        this.bcpWorkflowHistory = [];
        this.bcpWorkflow = [];
        this.changeRequestWorkflow = false;
    }

    @action
    setBcpContents(contents: any){
        this._bcpContents = contents;
        this.bcpContentsStringified = JSON.stringify(contents);
    }

    @action
    setBcpVersionHistory(versions: BcpVersions[]){
        this.bcpVersionHistory = versions
    }

    @computed
    get bcpVersionHistoryItems(){
        return this.bcpVersionHistory;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @computed
    get BcpList(): Bcp[] {
        return this._bcpList.slice();
    }

    @computed
    get bcpDetails(): BcpDetails{
        return this._bcpDetails;
    }

    @computed
    get bcpContents(){
        return this._bcpContents;
    }

    @observable
    workflowLoaded: boolean = false;

    @action
    setBcpWorkflow(workflow: BcpWorkFlowDetails[]){
        this.bcpWorkflow = workflow;
        this.workflowLoaded = true;
    }

    @observable
    bcpWorkflowHistory: BcpWorkflowHistory[] = [];

    @observable
    workflowHistoryPage: number = 1;

    @observable
    workflowHistoryLoaded: boolean = false;

    @observable
    workflowType: string;

    @observable
    workflowItemsPerPage: number = null;

    @observable
    workflowTotalItems: number = null;

    @observable
    changeRequestWorkflow: boolean = false;

    @action
    setBcpWorkflowHistory(history: WorkFlowHistoryPaginationResponse){
        this.bcpWorkflowHistory = history.data;
        this.workflowHistoryPage = history.current_page;
        this.workflowItemsPerPage = history.per_page;
        this.workflowTotalItems = history.total;
        this.workflowHistoryLoaded = true;
    }
 
}

export const BcpStore = new Store()