import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { MeetingType,MeetingTypePaginationResponse } from 'src/app/core/models/masters/mrm/meeting-type';

class Store {
    @observable
    private _meetingType: MeetingType[] = [];

    @observable
    loaded: boolean = false;


    @observable
    currentPage: number = 1;

   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'meeting_type_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setMeetingType(response: MeetingTypePaginationResponse) {
        
        this._meetingType = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllMeetingType(meetingType: MeetingType[]) {
       
        this._meetingType = meetingType;
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
    get allItems(): MeetingType[] {
        return this._meetingType.slice();
    }


}

export const MeetingTypeMasterStore = new Store();