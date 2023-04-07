import { observable, action, computed } from "mobx-angular";
import { WorkFlowList, WorkFlowDetails, ReviewUsersList, ApprovalUsersList, CurrentUsersList, WorkFlowPaginationResponse} from 'src/app/core/models/knowledge-hub/work-flow/workFlow'
import {DocumentWorkflow} from 'src/app/core/models/knowledge-hub/documents/documentWorkFlow'

class Store {

    @observable
    private _workFlowList: WorkFlowList[] = [];
    private _workFlowDetails: WorkFlowDetails;
    // private _reviewUsers: ReviewUsersList[]=[];
    // private _approvalUsers: ApprovalUsersList[] = [];
    // private _currentReviewUsers: CurrentUsersList[] = []
    // private _currentApprovalUsers:CurrentUsersList[]=[]

    private userDetails:DocumentWorkflow
    private activityLog

    workFlowLoaded: boolean = false;
    workFlowDetailsLoaded: boolean = false;
    // reviewUsersLoaded: boolean = false;
    // approvalUsersLoaded: boolean = false;
    // currentReviewUsersLoaded: boolean = false;
    // currentApprovalUsersLoaded: boolean = false;
    addFlag: boolean = true;
    // reviewTeam: boolean = false;
    // approvalTeam: boolean = false;
    workflowId: number = null;
    moduleGroupId: number = null;
    workflowPopupEnabled: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderBy: string='desc';

    @observable
    orderItem: string = 'document_workflows.id';

    searchText: string;

    @observable
    currentActivityPage: number = 1;

    @observable
    itemsPerPageActivity: number = null;

    @observable
    totalItemsActivity: number = null;

    @observable
    activityLogLoaded: boolean = false;


    // @action


    // @computed
 


    // @action
    // setWorkFlowList(data: WorkFlowList[]) {
    //     this._workFlowList = data
    //     this.workFlowLoaded = true;
    // }

    
    @action
    setWorkFlowList(data: WorkFlowPaginationResponse) {

        this.workFlowLoaded = true;
        this._workFlowList = data.data
        this.currentPage = data.current_page;
        this.itemsPerPage = data.per_page;
        this.totalItems = data.total;
    }

    unsetWorkFlowList() {
        this._workFlowList = [];
        this.workFlowLoaded = false;
    }

    setWorkFlowDetails(data: WorkFlowDetails) {
        this._workFlowDetails = data;
        this.workFlowDetailsLoaded = true;
    }

    unsetWorkFlowDetails() {
        this._workFlowDetails = null;
        this.workFlowDetailsLoaded = false;
    }

    // setReviewUsers(data:ReviewUsersList[]) {
    //     this._reviewUsers = data;
    //     this.reviewUsersLoaded = true;
    // }

    // setCurrentReviewUsers(data: CurrentUsersList[]) {
    //     this._currentReviewUsers = data;
    //     this.currentReviewUsersLoaded = true;
    // }

    // unsetCurrentReviewUsers() {
    //     this._currentReviewUsers = [];
    //     this.currentReviewUsersLoaded = false;
    // }

    // unsetReviewUsers() {
    //     this._reviewUsers = [];
    //     this.reviewUsersLoaded = false;
    // }

    // setApprovalUsers(data: ApprovalUsersList[]) {
    //     this._approvalUsers = data;
    //     this.approvalUsersLoaded = true;
    // }

    // setCurrentApprovalUsers(data: CurrentUsersList[]) {
    //     this._currentApprovalUsers = data;
    //     this.currentApprovalUsersLoaded = true;
    // }

    // unsetCurrentApprovalUsers() {
    //     this._currentApprovalUsers = [];
    //     this.currentApprovalUsersLoaded = false;
    // }

    // unsetApprovalUsers() {
    //     this._approvalUsers = [];
    //     this.approvalUsersLoaded = false;
    // }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setCurrentActivityLogPage(current_page: number) {
        this.currentActivityPage = current_page;
    }

    @computed
    get workFlowList(): WorkFlowList[] {
        return this._workFlowList
    }
    get workFlowDetails(): WorkFlowDetails{
        return this._workFlowDetails
    }

    @action
    setUserWorkflowDetails(response){
        this.userDetails=response
    }

    @computed
    get getUserWorkflow():DocumentWorkflow{
        return this.userDetails
    }

    @action
    setActivityLog(data){
        this.currentActivityPage = data.current_page;
        this.itemsPerPageActivity = data.per_page;
        this.totalItemsActivity = data.total;
        this.activityLog=data.data.filter(log=>log.activity_code !='DOCUMENT_VERSION_CONTENT_DETAILS')
        this.activityLogLoaded=true
    }

    @computed
    get getActivityLog(){
        return this.activityLog
    }

    @action
    unsetActivityLog(){
        this.activityLog=[]
        this.activityLogLoaded=false
    }
    // get reviewUsers(): ReviewUsersList[]{
    //     return this._reviewUsers
    // }
    // get approvalUsers(): ApprovalUsersList[]{
    //     return this._approvalUsers
    // }

    // get currentReviewUsers(): CurrentUsersList[]{
    //     return this._currentReviewUsers
    // }
    // get currentApprovalUsers(): CurrentUsersList[]{
    //     return this._currentApprovalUsers
    // }


}


export const WorkFlowStore = new Store()