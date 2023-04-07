import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { MeetingPlanStatus,MeetingPlanStatusPaginationResponse } from 'src/app/core/models/masters/mrm/meeting-plan-status';

class Store {
    @observable
    private _meetingPlanStatus: MeetingPlanStatus[] = [];

    @observable
    loaded: boolean = false;


    @observable
    currentPage: number = 1;

   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'meeting_plan_status_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setMeetingPlanStatus(response: MeetingPlanStatusPaginationResponse) {
        
        this._meetingPlanStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllMeetingPlanStatus(MeetingPlanStatus: MeetingPlanStatus[]) {
       
        this._meetingPlanStatus = MeetingPlanStatus;
        this.loaded = true;
        
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
    get allItems(): MeetingPlanStatus[] {
        return this._meetingPlanStatus.slice();
    }


}

export const MeetingPlanStatusMasterStore = new Store();