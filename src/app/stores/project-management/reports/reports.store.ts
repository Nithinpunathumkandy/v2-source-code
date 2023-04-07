import { observable, action, computed } from "mobx-angular";
import { TimeTrackerReport, TimeTrackerReportPaginationResponse } from "src/app/core/models/project-management/reports/reports";

class Store {
    @observable
    private _timeTrackerReport: TimeTrackerReport[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'project_time_trackers.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setTimeTrackerReport(response: TimeTrackerReportPaginationResponse) {        
        this._timeTrackerReport = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    unsetTimeTrackerReport() {
        this._timeTrackerReport = [];
        this.loaded = false;
    }

    @computed
    get timeTrackerReportList(): TimeTrackerReport[] {
        return this._timeTrackerReport;
    }

    @action
    setCurrentPage(currentPage: number) {
        this.currentPage = currentPage;
    }

    @action
    setOrderBy(orderBy: 'asc' | 'desc') {
        this.orderBy = orderBy;
    }

    @computed
    get allItems(): TimeTrackerReport[] {
        return this._timeTrackerReport.slice();
    }

}

export const TimeTrackerReportStore = new Store();