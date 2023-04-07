import { action, observable, computed } from "mobx-angular";
import { ReportPaginationResponse, Reports, ReportDetails } from 'src/app/core/models/mrm/meeting-report/meeting-report';
class store {



    @observable
    from: number = null;

    @observable
    totalItems: number = null;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = '';

    @observable
    editFlag: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';



    searchText: string;

    @observable
    reportsLoaded: boolean = false;

    @observable
    reportDetailsLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    // private _meetingReports[]: Reports[]=[];
    private _meetingReports: Reports[] = [];

    @observable
    private _reportDetails: ReportDetails;

    @action
    setMeetingReports(response: ReportPaginationResponse) {
        this._meetingReports = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.reportsLoaded = true;
    }

    @action
    unsetMeetingReportsList() {
        this._meetingReports = [];
        this.currentPage = null;
        this.itemsPerPage = null;
        this.totalItems = null;
        this.from = null;
        this.reportsLoaded = false;
    }

    @action
    setMeetingReportDetails(data: ReportDetails) {

        this._reportDetails = data
        this.reportDetailsLoaded = true;
    }

    @action
    unsetReportDetails() {
        this._reportDetails = null;
        this.reportDetailsLoaded = false;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    // @computed
    // get getModulegroups():ModuleGroupsResponse{
    //     return this._mrmManagementModules;
    // }

    @computed
    get meetingReports(): Reports[] {
        return this._meetingReports.slice();
    }
    @computed
    get reportDetails(): ReportDetails {
        return this._reportDetails
    }

    @action
    setMeetingReportDetailsLoaded() {
        this.reportDetailsLoaded = true;
    }


}
export const ReportStore = new store();