import { action, computed, observable } from "mobx-angular";
import { Events, EventsPaginationResponse, EventDetails, ExpectedOutcomesPaginationResponse, ExpectedOutcomes } from "src/app/core/models/event-monitoring/events/events"

class Store {
    @observable
    private _events: Events[] = [];

    @observable
    loaded: boolean = false;

    @observable
    allEventsList: null;

    @observable
    currentPage: number = 1;

    @observable
    _individualEventDetails: EventDetails = null;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'customers.created_at';

    @observable
    individualLoaded: boolean = false;

    @observable
    loadOutcomes: boolean = false;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @observable
    selectedEventId: number = null;

    @observable
    _selectedId: number = null;

    @observable
    _outcomes: ExpectedOutcomes[] = [];

    outcomesPerPage: number = null;

    totalOutcomes: number = null;

    outcomesCurrentPage: number = 1;

    @observable
    selectedEventList: Events[] = [];

    // @observable
    // _selectedId : number = 1;

    @observable
    scopeArray = []

    @observable
    exclusionArray = []

    @observable
    assumptionsArray = []

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOutcomesCurrentPage(page: number) {
        this.outcomesCurrentPage = page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setEventList(response: EventsPaginationResponse) {
        this._events = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setEventDetails(individualEvent: EventDetails) {
        this._individualEventDetails = individualEvent;
        this.individualLoaded = true;
    }
    @action
    setEventAllLists(Event: any) {
        this.allEventsList = Event
    }

    @action
    setEventOutcome(outcomes: ExpectedOutcomesPaginationResponse) {
        this._outcomes = outcomes.data;
        this.outcomesCurrentPage = outcomes.current_page;
        this.outcomesPerPage = outcomes.per_page;
        this.totalOutcomes = outcomes.total;
        this.loadOutcomes = true;
    }

    @action
    setSelectedEventId(id: number) {
        this._selectedId = id
    }

    @action
    unsetEventDetails() {
        this._individualEventDetails = null;
        this.individualLoaded = false;
    }
    @action
    unsetEventSelectdId() {
        this._selectedId = null;
    }

    @action
    eventlistmakeEmpty() {
        this._events = [];
        this.loaded = false;
    }

    // @action
    // setSelectedEventId(id:number){
    //     this._selectedId = id
    // }
    @observable
    saveSelected: boolean = false;
    
    @computed
    get selectedId() {
        return this._selectedId
    }

    @computed
    get eventOutcome() {
        return this._outcomes;
    }

    @action
    unsetEventOutcomes() {
        this._outcomes = [];
        this.outcomesCurrentPage = 1;
        this.outcomesPerPage = null;
        this.totalOutcomes = null;
        this.loadOutcomes = false;
    }

    @computed
    get eventDetails() {
        return this._individualEventDetails;
    }

    @computed
    get eventsList(): Events[] {
        return this._events.slice();
    }

    @action
    unsetEventsList() {
        this._events = [];
        this.currentPage = 1;
        this.loaded = false;
    }

    addSelectedEvent(issues) {
        this.selectedEventList = issues;
    }

    get selectedEventsList() {
        return this.selectedEventList;
    }


    /** Mapping Code By George */
    @observable
    selectedEvents: Events[] = [];


    addSelectedEvents(events) {
        this.selectedEvents = events;
    }

    @observable
    eventMappingModal: boolean = false;
}

export const EventsStore = new Store();