import { observable, action, computed } from "mobx-angular";
import {EventEquipment,EventEquipmentPaginationResponse,EventEquipmentSingle} from '../../../core/models/masters/event-monitoring/event-equipment'

class Store{
    @observable 
    private _eventEquipment:EventEquipment[]=[];

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
    individualEventEquipment: EventEquipmentSingle;

    @observable
    orderItem: string = 'event_equipments.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedEventEquipment: number = null;

    searchText: string;


    @observable
    add_conrol_type_modal: boolean = false

    @action
    setEventEquipment(response:EventEquipmentPaginationResponse){
        this._eventEquipment=response.data;
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
    updateEventEquipment(EventEquipment: EventEquipment) {
        const eventEquipment: EventEquipment[] = this._eventEquipment.slice();
        const index: number = eventEquipment.findIndex(e => e.id == EventEquipment.id);
        if (index != -1) {
            EventEquipment[index] = EventEquipment;
            this._eventEquipment = eventEquipment;
        }
    }
    @action
    setIndividualEventEquipment(eventEquipment: EventEquipmentSingle) {
       
        this.individualEventEquipment = eventEquipment;
        this.individualLoaded = true;
        
    }

    @computed
    get eventEquipment(): EventEquipment[] {
        
        return this._eventEquipment.slice();
    }

    @action
    getEventEquipmentById(id: number): EventEquipment {
        return this._eventEquipment.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedeventEquipment(eventEquipmentId: number){
        this.lastInsertedEventEquipment = eventEquipmentId;
    }

    get lastInsertedeventEquipment():number{
        if(this.lastInsertedEventEquipment) 
            return this.lastInsertedEventEquipment;
        else 
            return null;
    }
    get individualEventEquipmentId(){
        return this.individualEventEquipment;
    } 

}

export const EventEquipmentMasterStore = new Store();