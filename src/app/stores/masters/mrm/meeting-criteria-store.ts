import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { MeetingCriteria,MeetingCriteriaPaginationResponse } from 'src/app/core/models/masters/mrm/meeting-criteria';

class Store {
    @observable
    private _meetingCriteria: MeetingCriteria[] = [];


    @observable
    _selectedMeetingCriteriaAll: MeetingCriteria[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualMeetingCriteria: MeetingCriteria;

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
    orderItem: string = 'meeting_criteria.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @observable
    addMeetingCriteriaModal: boolean = false

    @action
    setMeetingCriteria(response: MeetingCriteriaPaginationResponse) {
        
        this._meetingCriteria = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllMeetingCriteria(meetingCriteria: MeetingCriteria[]) {
      
        this._meetingCriteria = meetingCriteria;
        this.loaded = true;
        
    }

    @action
    setIndividualMeetingCriteria(meetingCriteria: MeetingCriteria) {
       
        this.individualMeetingCriteria = meetingCriteria;
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
    get allItems(): MeetingCriteria[] {
        return this._meetingCriteria.slice();
    }

    

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getMeetingCriteriaById(id: number): MeetingCriteria {
        return this._meetingCriteria.slice().find(e => e.id == id);
    }

    @action
    deleteMeetingCriteriaById(id: number) {
        
        const index = this._selectedMeetingCriteriaAll.findIndex(e => e.id === id); 
        return this._selectedMeetingCriteriaAll.splice(index, 1); 
        
    }

    @computed
    get selectedAllItems(): MeetingCriteria[] {
        return this._selectedMeetingCriteriaAll.slice();
    }


    get individualMeetingCriteriaId(){
        return this.individualMeetingCriteria;
    } 

    get lastInsertedMeetingCriteria():number{
        if(this.lastInsertedId) 
            return this.lastInsertedId;
        else 
            return null;
    }

    @action
    addSelectedCriteria(issues){
        this._selectedMeetingCriteriaAll = issues;
    }

    

}

export const MeetingCriteriaMasterStore = new Store();