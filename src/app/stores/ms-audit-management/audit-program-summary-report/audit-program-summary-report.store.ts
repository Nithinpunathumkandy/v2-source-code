import { observable, action, computed } from "mobx-angular";
import { MsauditProgramReoport, MsauditProgramReoportDetails, MsAuditProgramReoportPaginationResponse } from "src/app/core/models/ms-audit-management/audit-program-summary-report/audit-program-summary-report";

class Store{
@observable
private _reportList: MsauditProgramReoport[] = [];

 @observable
 private _auditSummaryReportDetails : MsauditProgramReoportDetails = null

 @observable
 loaded: boolean = false;

 @observable
 selectedReportId : number = null;

 @observable
 individualLoaded = false

 @observable
 currentPage: number = 1;

 @observable
 itemsPerPage: number = 15;

 @observable
 totalItems: number = null;

 @observable
 from: number = null;

 @observable
 searchText:string='';

 @observable
 orderItem: string = '';

 @observable
 last_page: number = null;

 @observable
 orderBy: 'asc' | 'desc' = 'desc';

    @action
    setAuditSummaryList(response : MsAuditProgramReoportPaginationResponse){
        this._reportList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setSelecetdReportId(id:number){
        this.selectedReportId = id;
    }

    @action
    setIndividualMsAuditPrgramsReportDetails(response : MsauditProgramReoportDetails){
        this.individualLoaded = true;
        this._auditSummaryReportDetails = response;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @computed
    get allItems() : MsauditProgramReoport[]{
        return this._reportList
    }

    @computed
    get IndividualMsAuditPrgramsReportDetails() : MsauditProgramReoportDetails{
        return this._auditSummaryReportDetails
    }

}
export const AuditProgramSummaryReportStore =new Store();