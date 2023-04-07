
import { observable, action, computed } from "mobx-angular";
import { ActivityLogPaginationResponse, ActivityLogs, AnnualSummary } from "src/app/core/models/ms-audit-management/ms-audit-annual-summary/ms-audit-annual-summary";

class Store{

    @observable
    private _activityLogs: ActivityLogs[] = [];

    @observable
    private _annualSummaryDetails:AnnualSummary=null


    @observable
    loaded: boolean = false;

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
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }



    @action
    setAnnualSummary(details: AnnualSummary,noData:boolean) {
        if(noData){
            // this.loaded = true;
            this._annualSummaryDetails = null;
        }
        else{
            // this.loaded = true;
            this._annualSummaryDetails = details;
        }
    }

    @action
    clearAnnualSummary() {
        this.loaded = false;
        this._annualSummaryDetails = null;
    }
    
    @computed
    get AnnualSummaryDetails(): AnnualSummary {
        return this._annualSummaryDetails;
    }

    @action
    setActivityLogs(response: ActivityLogPaginationResponse) {

        this._activityLogs = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unSetActivityLogs(){
        this.loaded = false;
        this.from = null;
        this.totalItems = null;
        this.currentPage = null;
        this._activityLogs = [];
        this.itemsPerPage = null;
    }

    @computed
    get allItems(): ActivityLogs[] {
        return this._activityLogs.slice();
    }

}
export const AnnualSummaryStore =new Store();