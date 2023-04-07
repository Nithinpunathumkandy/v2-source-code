import { observable, action, computed } from "mobx-angular";
import {EventMatrixType,EventMatrixTypePaginationResponse,EventMatrixTypeSingle} from '../../../core/models/masters/event-monitoring/event-maturity-matrix-types'

class Store{
    @observable 
    private _eventMatrixType:EventMatrixType[]=[];

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
    individualEventMatrixType: EventMatrixTypeSingle;

    @observable
    orderItem: string = 'event_maturity_matrix_types.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedEventMatrixType: number = null;

    searchText: string;


    @observable
    add_conrol_type_modal: boolean = false

    @action
    setEventMatrixType(response:EventMatrixTypePaginationResponse){
        this._eventMatrixType=response.data;
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
    updateEventMatrixType(EventMatrixType: EventMatrixType) {
        const eventMatrixType: EventMatrixType[] = this._eventMatrixType.slice();
        const index: number = eventMatrixType.findIndex(e => e.id == EventMatrixType.id);
        if (index != -1) {
            EventMatrixType[index] = EventMatrixType;
            this._eventMatrixType = eventMatrixType;
        }
    }
    @action
    setIndividualEventMatrixType(eventMatrixType: EventMatrixTypeSingle) {
       
        this.individualEventMatrixType = eventMatrixType;
        this.individualLoaded = true;
        
    }

    @computed
    get eventMatrixType(): EventMatrixType[] {
        
        return this._eventMatrixType.slice();
    }

    @action
    getEventMatrixTypeById(id: number): EventMatrixType {
        return this._eventMatrixType.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedeventMatrixType(eventMatrixTypeId: number){
        this.lastInsertedEventMatrixType = eventMatrixTypeId;
    }

    get lastInsertedeventMatrixType():number{
        if(this.lastInsertedEventMatrixType) 
            return this.lastInsertedEventMatrixType;
        else 
            return null;
    }
    get individualEventMatrixTypeId(){
        return this.individualEventMatrixType;
    } 

}

export const EventMatrixTypeMasterStore = new Store();