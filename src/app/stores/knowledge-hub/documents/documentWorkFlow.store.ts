import { ChangeRequestPaginationResponse,ChangeRequest, ChangeRequestDetails } from 'src/app/core/models/knowledge-hub/change-request/change-request'
import { observable, action, computed } from "mobx-angular";
import { Image } from "src/app/core/models/knowledge-hub/documents/documents";
import {DocumentWorkflow,ReviewUser,WorkflowHistoryPagination,WorkflowHistory} from 'src/app/core/models/knowledge-hub/documents/documentWorkFlow'


class Store {

    @observable
    private _workflowData: DocumentWorkflow[]
    private _workflowHistoryData:WorkflowHistory[]=[]
    
    @observable
    private _nextReviewUser: ReviewUser
    
    @observable
    private _checkinFile: Image = null;

    @observable
    preview_url: string;

    @observable
    documentWorkflow_loaded: boolean = false;
    workflowHistoryLoaded: boolean = false;

    commentForm: boolean = false;
    workflowActionPopup:boolean=false;
    checkinForm:boolean = false;
    showHistory: boolean = false;
    submitPopup:boolean=false;
    showActivity: boolean = false;
    showUpdate: boolean = false;
    showReviewUpdatePopup:boolean=false;
    showHistoryPopup:boolean = false;
    showWorkflowPopup:boolean = false;
    type: string 
    moduleType: string;
    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    nextReviewUserLevel: number = null;
    nextReviewUserId:number=null;
    finalReviewUserLevel: number = null;
    
    @observable
    orderBy: string='asc';

    @observable
    orderItem: string = 'ref_no';
    
    searchText: string;


    @action
    setDocumentWorkflow(response:DocumentWorkflow[]) {    
        this.documentWorkflow_loaded = true;
        this._workflowData = response;
        // this._nextReviewUser = response.next_review_user
        // this.nextReviewUserLevel = response.next_review_level
        // this.finalReviewUserLevel=response.workflow[response.workflow.length-1].level
        this.finalReviewUserLevel = response.length > 0 ? response[response.length - 1].level : null;
    }

    @action
    setWorkflowHistory(data: WorkflowHistoryPagination) {
        this.workflowHistoryLoaded = true;
        this._workflowHistoryData = data.data;
    }
    @action
    unsetWorkflowHistory(){
        this.workflowHistoryLoaded = false;
        this._workflowHistoryData = [];
    }
    
    
    @action
    unsetDocumentWorkflow(){
        this.documentWorkflow_loaded = false;
        this._workflowData = null;
        this._nextReviewUser = null;
    }
    @computed
    get documentWorkflow(): DocumentWorkflow[]{
        return this._workflowData
    }

    get documentWorkflowHistory(): WorkflowHistory[]{
        return this._workflowHistoryData
    }

    get nextReviewUser(): ReviewUser{
        return this._nextReviewUser
    }

    @action //Sets Version File
    setCheckinFile(details:Image, url: string){
 
            this._checkinFile = details
            this.preview_url = url;
        
        
    }

    @action
    unsetFileDetails() {
            // Delete Checkin File
            if(this._checkinFile.hasOwnProperty('is_new')){
                this._checkinFile = null;
                this.preview_url = null;
            }
            else{
                this._checkinFile['is_deleted'] = true;
                this.preview_url = null;
            } 
    }

    @action
    clearCheckinFile() {
        this._checkinFile = null;
    }

    get getCheckinFile(): Image{
        return this._checkinFile;
    }
    
}
export const documentWorkFlowStore = new Store();