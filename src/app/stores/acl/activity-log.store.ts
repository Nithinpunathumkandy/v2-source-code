import { action, computed, observable } from "mobx";
import { ActivityLog, ActivityLogPaginationResponse } from "src/app/core/models/acl/activity-log";

class Store{
    @observable
    private _activityLog:ActivityLog[] = [];

    @observable
    private _logDetails = null;

    @observable
    loaded:boolean =false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'activity_module';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    from: number = null;

    searchText: string;
    
    @action
    setCurrentPage(currentPage: number) {
        this.currentPage = currentPage;
    }
    
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @computed
    get allItems(): ActivityLog[]{
        return this._activityLog.slice();
    }

    @action
    setActivityLog(response:ActivityLogPaginationResponse){
        this._activityLog = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setLogDetails(details){
        this._logDetails = details;
    }

    
    get logDetails(){
        return this._logDetails;
    }

}

export const ActivityLogStore = new Store();