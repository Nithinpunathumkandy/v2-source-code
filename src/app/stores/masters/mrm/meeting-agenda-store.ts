import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { MeetingAgenda,MeetingAgendaDetails,MeetingAgendaPaginationResponse } from 'src/app/core/models/masters/mrm/meeting-agenda';

class Store {
    @observable
    private _meetingAgenda: MeetingAgenda[] = [];

    @observable
    _selectedMeetingAgendaAll: MeetingAgenda[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualMeetingAgenda: MeetingAgendaDetails;

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
    orderItem: string = 'meeting_agendas.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    newMeetingAgenda: any = [];

    selectedMeeting = null;

    updateItem = null;

    searchText: string;

    @observable
    addMeetingAgendaModal: boolean = false;

    @action
    setMeetingAgenda(response: MeetingAgendaPaginationResponse) {
        
        this._meetingAgenda = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllMeetingAgenda(meetingAgenda: MeetingAgenda[]) {
       
        this._meetingAgenda = meetingAgenda;
        this.loaded = true;
        
    }

    @action
    setIndividualMeetingAgenda(meetingAgenda: MeetingAgendaDetails) {
       
        this.individualMeetingAgenda = meetingAgenda;
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
    get allItems(): MeetingAgenda[] {
        return this._meetingAgenda.slice();
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    get individualMeetingAgendaId(){
        return this.individualMeetingAgenda;
    } 

    @action
    deleteMeetingAgendaById(id: number) {
        
        const index = this._selectedMeetingAgendaAll.findIndex(e => e.id === id); 
        return this._selectedMeetingAgendaAll.splice(index, 1); 
        
    }

    @computed
    get selectedAllItems(): MeetingAgenda[] {
        return this._selectedMeetingAgendaAll.slice();
    }

    @action
    addSelectedAgenda(issues){
        this._selectedMeetingAgendaAll = issues;
    }

}

export const MeetingAgendaMasterStore = new Store();