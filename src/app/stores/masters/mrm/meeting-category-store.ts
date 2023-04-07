import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { MeetingCategory,MeetingCategoryPaginationResponse } from 'src/app/core/models/masters/mrm/meeting-category';

class Store {
    @observable
    private _meetingCategory: MeetingCategory[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualMeetingCategory: MeetingCategory;

    @observable
    individualLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    lastInsertedId: number = null;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'meeting_categories.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setMeetingCategory(response: MeetingCategoryPaginationResponse) {
        
        this._meetingCategory = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllMeetingCategory(meetingCategory: MeetingCategory[]) {
       
        this._meetingCategory = meetingCategory;
        this.loaded = true;
        
    }

    @action
    setIndividualMeetingCategory(meetingCategory: MeetingCategory) {
       
        this.individualMeetingCategory = meetingCategory;
        this.individualLoaded = true;
        
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
    get allItems(): MeetingCategory[] {
        return this._meetingCategory.slice();
    }

    

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getMeetingCategoryById(id: number): MeetingCategory {
        return this._meetingCategory.slice().find(e => e.id == id);
    }

    get individualMeetingCategoryId(){
        return this.individualMeetingCategory;
    } 

}

export const MeetingCategoryMasterStore = new Store();