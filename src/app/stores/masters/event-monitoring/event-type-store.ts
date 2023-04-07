import { observable, action, computed } from "mobx-angular";
import {EventType,EventTypePaginationResponse,EventTypeSingle} from '../../../core/models/masters/event-monitoring/event-type'

class Store{
    @observable 
    private _eventType:EventType[]=[];

    @observable 
    loaded:boolean=false;
   
    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    individualLoaded: boolean = false;

    @observable
    individualEventType: EventTypeSingle;

    @observable
    orderItem: string = 'event_types.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedEventType: number = null;

    searchText: string;


    @observable
    add_conrol_type_modal: boolean = false

    @action
    setEventType(response:EventTypePaginationResponse){
        this._eventType=response.data;
        this.currentPage=response.current_page;
        this.itemsPerPage=response.per_page;
        this.totalItems=response.total;
        this.from = response.from;
        this.loaded=true;
    }

    @action
    setCurrentPage(current_page:number){
        this.currentPage=current_page;
    }

   
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    updateEventType(EventType: EventType) {
        const eventType: EventType[] = this._eventType.slice();
        const index: number = eventType.findIndex(e => e.id == EventType.id);
        if (index != -1) {
            EventType[index] = EventType;
            this._eventType = eventType;
        }
    }
    @action
    setIndividualEventType(eventType: EventTypeSingle) {
       
        this.individualEventType = eventType;
        this.individualLoaded = true;
        
    }

    @computed
    get eventType(): EventType[] {
        
        return this._eventType.slice();
    }

    @action
    getEventTypeById(id: number): EventType {
        return this._eventType.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedeventType(eventTypeId: number){
        this.lastInsertedEventType = eventTypeId;
    }

    get lastInsertedeventType():number{
        if(this.lastInsertedEventType) 
            return this.lastInsertedEventType;
        else 
            return null;
    }
    get individualEventTypeId(){
        return this.individualEventType;
    } 

}

export const EventTypeMasterStore = new Store();