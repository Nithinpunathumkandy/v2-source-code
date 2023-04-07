import { action, computed, observable } from "mobx-angular";
import { EventClosure, EventClosurePaginationResponse, indivitualEventClosure , EventClosureWorkflow , WorkflowHistoryPagination , WorkflowHistory } from "src/app/core/models/event-monitoring/event-closure";
import { Image } from "src/app/core/models/image.model";
import { ReviewUser } from "src/app/core/models/knowledge-hub/change-request/change-request-workflow";


class Store {
    @observable
    private _eventClosure: EventClosure[] = [];

    @observable
    loaded: boolean = false;

    @observable
    routeMainListing: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    lastInsertedEventClosure: number = null;

    @observable
    orderItem: string = 'event_closure.title';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    private _documentDetails: Image = null;

    searchText: string;

    @observable 
    _indivitualEventClosure = null;

    //Workflow item starts here
    @observable
    closureWorkflowLoaded: boolean = false;

    @observable
    private _workflowData: EventClosureWorkflow[]

    @observable
    private _nextReviewUser: ReviewUser

    @observable
    finalReviewUserLevel: number = null;

    @observable
    closureId: number = null;

    @observable
    workflowType:string

    @observable
    private _workflowHistoryData:WorkflowHistory[]=[]

    @observable
    workflowHistoryLoaded: boolean = false;

    @observable
    fromWorkflow: number = null;

    @observable
    currentWorkflowPage: number = 1;

    @observable
    itemsWorkflowPerPage: number = null;

    @observable
    totalWorkflowItems: number = null;
    
    @observable
    individualLoaded: boolean=false

    @action
    setEventClosure(response: EventClosurePaginationResponse) {

        this._eventClosure = response.data;
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
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }


    @action
    clearDocumentDetails() {
        this._documentDetails = null;
        // this.preview_url = null;
    }
   
    @action
    setDocumentDetails(details: Image,url: string) {
        
            this._documentDetails = details;
            // this.preview_url = url;
        
    }

    @action
    unsetDocumentDetails(token?:string){
        
            if (this._documentDetails.hasOwnProperty('is_new')) {
                this._documentDetails = null;
                // this.preview_url = null;
            }
            else {
                this._documentDetails['is_deleted'] = true;             
            }   
       
    }

    @computed
    get docDetails(): Image {
        return this._documentDetails;
    }

    @computed
    get EventClosure(): EventClosure[] {

        return this._eventClosure.slice();
    }

    @computed
    get allItems(): EventClosure[] {

        return this._eventClosure.slice();
    }

    @action
    setLastInsertedEventClosure(eventClosureId: number){
        this.lastInsertedEventClosure = eventClosureId;
    }

    get lastInsertedeventClosure():number{
        if(this.lastInsertedEventClosure) 
            return this.lastInsertedEventClosure;
        else 
            return null;
    }
    
    // get individualEventClosureId(){
    //     return this.individualEventClosure;
    // } 

    @action
    setIndivitualEventClosure(indivitual: indivitualEventClosure) {       
        this._indivitualEventClosure = indivitual;
        this.individualLoaded = true;
    
    }

    @action
    unsetIndivitualEventClosure() {       
        this._indivitualEventClosure = null;
        this.routeMainListing=false;
        this.individualLoaded = false;   
    }

    get indivitualEventClosure(){
    return this._indivitualEventClosure
    }

    @action
    setEventClosureWorkflow(response:EventClosureWorkflow[]) {    
        this.closureWorkflowLoaded = true;
        this._workflowData = response;
        // this._nextReviewUser = response.next_review_user
        // this.nextReviewUserLevel = response.next_review_level
        // this.finalReviewUserLevel=response.workflow[response.workflow.length-1].level
        this.finalReviewUserLevel = response.length > 0 ? response[response.length - 1].level : null;
    }

    @action
    unsetEventClosureWorkflow(){
        this.closureWorkflowLoaded = false;
        this._workflowData = null;
        this._nextReviewUser = null;
    }

    @action
    setRouteMainListing(){
        this.routeMainListing = true;
       
    }
    
    @computed
    get closureWorkflow(): EventClosureWorkflow[]{
        return this._workflowData
    }

    setWorkflowHistory(data){
        this.workflowHistoryLoaded = true;
        this.currentWorkflowPage = data.current_page;
        this.itemsWorkflowPerPage = data.per_page;
        this.totalWorkflowItems = data.total;
        this.fromWorkflow = data.from;
        this._workflowHistoryData = data.data;
    }
    
    @computed
    get workflowHistory(): WorkflowHistory[]{
        return this._workflowHistoryData
    }

    @action
    unsetWorkflowHistory(){
        this.workflowHistoryLoaded = false;
        this._workflowHistoryData = [];
    }

    @action
    unsetEventClosure(){
        this._eventClosure = [];
        this.currentPage=1;
        this.loaded = false;
        this.orderBy='desc';
        this.orderItem='event_closure.title';
    }

}

export const EventClosureStore = new Store();