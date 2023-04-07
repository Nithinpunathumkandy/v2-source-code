import { ChangeRequestPaginationResponse,ChangeRequest, ChangeRequestDetails } from 'src/app/core/models/knowledge-hub/change-request/change-request'
import { observable, action, computed } from "mobx-angular";
import { Image } from "src/app/core/models/knowledge-hub/documents/documents";
import { ChangeRequestWorkflow, ReviewUser , WorkflowHistory , CRWorkflowHistoryPagination } from "src/app/core/models/knowledge-hub/change-request/change-request-workflow";

class Store{

    @observable
    private _changeRequestList: ChangeRequest[] = [];

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderBy: string='desc';

    @observable
    orderItem: string = 'document_change_requests.id';

    @observable
    searchText: string;

    // cR---Change Request

    @observable
    cRlistLoaded: boolean = false;

    @observable
    preview_url: string;

    @observable
    editCheck: boolean = false;

    @observable
    documentId: number = null;

    @observable
    changedFileID: number = null;

    @observable
    enableWorkflow: boolean=false

    @observable
    enableButtons: boolean=false

    @observable
    changeRequestId:number=null

    @observable
    private _newDocument: Image = null;

    @observable
    private _requestDetails: ChangeRequestDetails

    @observable
    requestdetailsLoaded: boolean = false;

    //Workflow item starts here
    @observable
    change_request_workflow_loaded: boolean = false;

    @observable
    private _workflowData: ChangeRequestWorkflow[]

    @observable
    private _nextReviewUser: ReviewUser

    @observable
    private _workflowHistoryData:WorkflowHistory[]=[]

    @observable
    workflowHistoryLoaded: boolean = false;

    nextReviewUserLevel: number = null;
    nextReviewUserId:number=null;
    finalReviewUserLevel: number = null;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setChangeRequestData(response:ChangeRequestPaginationResponse) {    
        this.cRlistLoaded = true;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this._changeRequestList = response.data;
    }

    unsetChangeRequest() {
        this.cRlistLoaded = false;
        this._changeRequestList = [];
    }

    @action
    setRequestDetails(response: ChangeRequestDetails) {
        this.requestdetailsLoaded = true;
        this._requestDetails=response
    }

    unsetChangeRequestDetails() {
        this.requestdetailsLoaded = false;
        this._requestDetails = null;
    }


    @computed
    get changeRequestList(): ChangeRequest[] {
        return this._changeRequestList
    }


    @computed
    get requestDetails(): ChangeRequestDetails {
        return this._requestDetails
    }

    @action //Sets New  Document
    setNewDocument(details: Image, url: string) {
 
            this._newDocument=details
            this.preview_url = url;
        
        
    }

    @action
    unsetFileDetails() {

            // Delete New Document 
            if(this._newDocument.hasOwnProperty('is_new')){
                this._newDocument = null;
                this.preview_url = null;
            }
            else{
                this._newDocument['is_deleted'] = true;
                this.preview_url = null;
            }

    }

    @action
    clearNewDocument() {
        this._newDocument = null;
    }

    get getNewDocument(): Image{
        return this._newDocument;
    }

    @action
    setChangeRequestId(id: number) {
        this.changeRequestId = id;
    }

    @computed
    get getChangeRequestId(){
        return this.changeRequestId
    }

    @action
    setChangeRequestWorkflow(response:ChangeRequestWorkflow[]) {    
        this.change_request_workflow_loaded = true;
        this._workflowData = response;
        // this._nextReviewUser = response.next_review_user
        // this.nextReviewUserLevel = response.next_review_level
        // this.finalReviewUserLevel=response.workflow[response.workflow.length-1].level
        this.finalReviewUserLevel = response.length > 0 ? response[response.length - 1].level : null;
    }

    @action
    unsetChangeRequestWorkflow(){
        this.change_request_workflow_loaded = false;
        this._workflowData = null;
        this._nextReviewUser = null;
    }
    
    @computed
    get changeRequestWorkflow(): ChangeRequestWorkflow[]{
        return this._workflowData
    }

    @action
    setWorkflowHistory(data: CRWorkflowHistoryPagination) {
        this.workflowHistoryLoaded = true;
        this._workflowHistoryData = data.data;
    }

    @computed
    get changeRequestWorkflowHistory(): WorkflowHistory[]{
        return this._workflowHistoryData
    }

    @action
    unsetWorkflowHistory(){
        this.workflowHistoryLoaded = false;
        this._workflowHistoryData = [];
    }


}

export const changeRequestStore = new Store()