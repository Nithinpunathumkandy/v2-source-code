import { observable, action, computed } from "mobx-angular";
import { MeetingAgendaType, MeetingAgendaTypePaginationResponse } from "src/app/core/models/masters/mrm/meeting-agenda-type";

class Store{

    @observable
    private _meetingAgendaTypes:MeetingAgendaType[] = [];

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
    get allItems(): MeetingAgendaType[]{
        return this._meetingAgendaTypes.slice();
    }

    @action
    setMeetingAgendaType(response:MeetingAgendaTypePaginationResponse){
        
        this._meetingAgendaTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }
}

export const MeetingAgendaTypeMasterStore = new Store();