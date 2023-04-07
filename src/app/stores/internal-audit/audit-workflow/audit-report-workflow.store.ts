import { observable, action, computed } from "mobx-angular";
import { Image } from "src/app/core/models/knowledge-hub/documents/documents";
// import {DocumentWorkflow,ReviewUser,WorkflowHistoryPagination,WorkflowHistory} from 'src/app/core/models/knowledge-hub/documents/documentWorkFlow'
import {AuditReportWorkflowDetail,AuditReportWorkflowHistoryPaginationResponse,AuditReportWorkflowHistory} from 'src/app/core/models/internal-audit/report/audit-report-workflow'

class Store {

    @observable
    private _auditReportWorkflowData
    private _auditReportWorkflowHistoryData
    
    // @observable
    // private _nextReviewUser: ReviewUser
    
    @observable
    preview_url: string;

    @observable
    auditReportWorkflow_loaded: boolean = false;
    workflowHistoryLoaded: boolean = false;

    workflowForm: boolean = false;
    showHistory: boolean = false;
    submitPopup:boolean=false;
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
    auditReportId:number;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setAuditReportWorkflow(response:AuditReportWorkflowDetail) {    
        this.auditReportWorkflow_loaded = true;
        this._auditReportWorkflowData = response;
        // this.finalReviewUserLevel = response.length > 0 ? response[response.length - 1].level : null;
    }
    @action
    unsetDocumentWorkflow(){
        this.auditReportWorkflow_loaded = false;
        this._auditReportWorkflowData = null;
        // this._nextReviewUser = null;
    }

    @action
    setWorkflowHistory(response: AuditReportWorkflowHistoryPaginationResponse) {
        this.workflowHistoryLoaded = true;
        this._auditReportWorkflowHistoryData = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
    }
    @action
    unsetWorkflowHistory(){
        this.workflowHistoryLoaded = false;
        this._auditReportWorkflowHistoryData = [];
    }
    
    

    @computed
    get auditReportWorkflow(): AuditReportWorkflowDetail[]{
        return this._auditReportWorkflowData
    }

    get auditReportWorkflowHistory(): AuditReportWorkflowHistory{
        return this._auditReportWorkflowHistoryData
    }

    // get nextReviewUser(): ReviewUser{
    //     return this._nextReviewUser
    // }


}
export const AuditReportWorkflowStore = new Store();