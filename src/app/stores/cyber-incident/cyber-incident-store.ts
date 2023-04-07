import { observable, action, computed } from "mobx-angular";
import { CyberIncident, CyberIncidentPaginationResponse, IndividualCyberIncident,CyberWorkflowDetail, 
    CyberWorkflowHistoryPaginationResponse, CyberWorkflowHistory } from "src/app/core/models/cyber-incident/cyber-incident";
class Store {

    @observable
    private _cyberIncident: CyberIncident[] = [];

    @observable
    private _cyberWorkflowList;

    @observable
    _cyberWorkflowHistory:CyberWorkflowHistory[]=[];

    @observable
    loaded: boolean = false;

    @observable
    workflowLoaded:boolean=false;

    @observable
    individualLoaded: boolean = false;

    @observable
    _individualCyberIncident: IndividualCyberIncident;

    @observable
    currentPage: number = 1;

    @observable
    incidentId: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    lastInsertedId:number=null;

    @observable
    last_page: number = null;

    @observable
    preview_url: string;

    @observable
    workflowCurrentPage:number=1;

    @observable
    workflowiItemsPerPage:number;

    @observable
    workflowtTotalItems:number;

    @observable
    historyLoaded:boolean=false;

    @observable
    type=''

    @observable
    orderItem: string = 'cyber_incident.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    searchText: string;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }


    @action
    setAllCyberIncident(response: CyberIncidentPaginationResponse) {
        this._cyberIncident = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;

    }

    @computed
    get allItems(): CyberIncident[] {
        return this._cyberIncident;
    }

    @action
    unsetCyberIncident() {
        this._cyberIncident = [];
        this.currentPage = 1;
        this.loaded = false;
    }

    @action
    setCyberIncidentDetails(details: IndividualCyberIncident) {
        this._individualCyberIncident = details;
        this.individualLoaded = true;
    }
    
    @computed
    get cyberIncidentDetails():IndividualCyberIncident {
        return this._individualCyberIncident;
    }

    @action
    unsetSelectedItemDetails() {
        this.individualLoaded = false;
        this._individualCyberIncident = null;
    }

    @action
    setIncidentId(id: number) {
        this.incidentId = id;
    }

    // @computed
    // getIncidentId(): number {
    //     return this.incidentId;
    // }

    @action
    setCurrentWorkflowHistoryPage(id:number)
    {
        this.workflowCurrentPage=1;
    }

    @action
    setWorkflowDetails(response: CyberWorkflowDetail) {
        this._cyberWorkflowList = response;
        this.workflowLoaded = true;
    }
    @computed
    get workflowDetails(): CyberWorkflowDetail[] {
        return this._cyberWorkflowList;
    }

    @action
    setWorkflowHistory(response: CyberWorkflowHistoryPaginationResponse) {
        this._cyberWorkflowHistory = response.data;
         this.workflowCurrentPage = response.current_page;
        this.workflowiItemsPerPage = response.per_page;
        this.workflowtTotalItems = response.total;
        this.historyLoaded = true;
    }
    
    @computed
    get workflowHistoryDetails(): CyberWorkflowHistory[] {
        return this._cyberWorkflowHistory;
    }

}



export const CyberIncidentStore = new Store();
