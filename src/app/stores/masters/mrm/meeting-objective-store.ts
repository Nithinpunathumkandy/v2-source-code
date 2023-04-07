import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { MeetingObjective,MeetingObjectivePaginationResponse } from 'src/app/core/models/masters/mrm/meeting-objective';

class Store {
    @observable
    private _meetingObjective: MeetingObjective[] = [];


    @observable
    _selectedMeetingObjectiveAll: MeetingObjective[] = [];


    @observable
    loaded: boolean = false;

    @observable
    individualMeetingObjective: MeetingObjective;

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
    orderItem: string = 'meeting_objectives.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @observable
    addMeetingObjectiveModal: boolean = false

    @action
    setMeetingObjective(response: MeetingObjectivePaginationResponse) {
        
        this._meetingObjective = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllMeetingObjective(meetingObjective: MeetingObjective[]) {
       
        this._meetingObjective = meetingObjective;
        this.loaded = true;
        
    }

    @action
    setIndividualMeetingObjective(meetingObjective: MeetingObjective) {
       
        this.individualMeetingObjective = meetingObjective;
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
    get allItems(): MeetingObjective[] {
        return this._meetingObjective.slice();
    }

    

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getMeetingObjectiveById(id: number): MeetingObjective {
        return this._meetingObjective.slice().find(e => e.id == id);
    }

    @action
    deleteMeetingObjectiveById(id: number) {
        
        const index = this._selectedMeetingObjectiveAll.findIndex(e => e.id === id); 
        return this._selectedMeetingObjectiveAll.splice(index, 1); 
        
    }

    @computed
    get selectedAllItems(): MeetingObjective[] {
        return this._selectedMeetingObjectiveAll.slice();
    }

    get individualMeetingObjectiveId(){
        return this.individualMeetingObjective;
    } 

    get lastInsertedMeetingObjective():number{
        if(this.lastInsertedId) 
            return this.lastInsertedId;
        else 
            return null;
    }
    @action
    addSelectedObjective(issues){
        this._selectedMeetingObjectiveAll = issues;
    }
}

export const MeetingObjectiveMasterStore = new Store();