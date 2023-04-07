import { observable, action, computed } from "mobx-angular";
import { MeetingActionPlanStatus, MeetingActionPlanStatusPaginationResponse } from "src/app/core/models/masters/mrm/meeting-action-plan-status";
import { MeetingReportStatus, MeetingReportStatusPaginationResponse } from "src/app/core/models/masters/mrm/meeting-report-status";

class Store{

    @observable
    private _meetingActionPlanStatus:MeetingActionPlanStatus[] = [];

    @observable
    loaded:boolean =false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'meeting_action_plan_status_language.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    from: number = null;

    searchText: string;

    @action
    setCurrentPage(currentPage: number) {
        this.currentPage = currentPage;
    }

    @computed
    get allItems(): MeetingActionPlanStatus[]{
        return this._meetingActionPlanStatus.slice();
    }

    @action
    setMeetingActionPlanStatus(response:MeetingActionPlanStatusPaginationResponse){
        
        this._meetingActionPlanStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }
}

export const MeetingActionPlanStatusMasterStore = new Store();