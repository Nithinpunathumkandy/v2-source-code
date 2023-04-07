import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { EventEngagementStrategy, EventEngagementStrategyPaginationResponse, EventEngagementStrategySingle } from "src/app/core/models/masters/event-monitoring/event-engagement-strategy";

class Store {
    @observable
    private _eventEngagementStrategy: EventEngagementStrategy[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    lastInsertedId: number = null;

    @observable
    orderItem: string = 'event_engagement_strategies.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    individualLoaded: boolean = false;

    @observable
    individualEventEngagementStrategy: EventEngagementStrategySingle;

    // @observable
    // eventEngagementStrategyDetails: any;

    searchText: string;

    @observable
    selectedEventEngagementStrategyList: EventEngagementStrategy[] = [];

    @observable
    saveSelected: boolean = false;

    // @observable
    // business_application_select_form_modal: boolean = false;

    @action
    setEventEngagementStrategy(response: EventEngagementStrategyPaginationResponse) {

        this._eventEngagementStrategy = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unsetEventEngagementStrategy() {
        this._eventEngagementStrategy = [];
        this.loaded = false;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    
    // @action
    // updateEventEngagementStrategy(type: EventEngagementStrategy) {
    //     // const types: EventEngagementStrategy[] = this._eventEngagementStrategy.slice();
    //     // const index: number = types.findIndex(e => e.id == type.id);
    //     // if (index != -1) {
    //     //     types[index] = type;
    //     //     this._eventEngagementStrategy = types;
    //     // }
    //     this.eventEngagementStrategyDetails=type
    // }

    @action
    setIndividualEventEngagementStrategy(eventType: EventEngagementStrategySingle) {
       
        this.individualEventEngagementStrategy = eventType;
        this.individualLoaded = true;
        
    }
    get individualEventEngagementStrategyId(){
        return this.individualEventEngagementStrategy;
    } 

    @computed
    get eventEngagementStrategys(): EventEngagementStrategy[] {

        return this._eventEngagementStrategy.slice();
    }
    @computed
    get eventEngagementStrategy(): EventEngagementStrategy[] {

        return this._eventEngagementStrategy.slice();
    }

    @action
    getEventEngagementStrategyById(id: number): EventEngagementStrategy {
        return this._eventEngagementStrategy.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedId(id: number) {
        this.lastInsertedId = id;
    }

    get LastInsertedId(): number {
        if (this.lastInsertedId)
            return this.lastInsertedId;
        else
            return null;
    }

    @action
    addSelectedEventEngagementStrategy(issues){
        this.selectedEventEngagementStrategyList = issues;
    }

    unsetSelectedEventEngagementStrategy(){
        this.selectedEventEngagementStrategyList = [];
    }
}

export const EventEngagementStrategyMasterStore = new Store();