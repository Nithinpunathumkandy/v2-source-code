import { observable, action, computed } from "mobx-angular";
import {EventMaturityMatrixParameter,EventMaturityMatrixParameterPaginationResponse,EventMaturityMatrixParameterSingle} from '../../../core/models/masters/event-monitoring/event-maturity-matrix-parameter'

class Store{
    @observable 
    private _eventMaturityMatrixParameter:EventMaturityMatrixParameter[]=[];

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
    individualMaturityMatrixParameter: EventMaturityMatrixParameterSingle;

    @observable
    orderItem: string = 'event_maturity_matrix_parameters.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedEventMaturityMatrixParameter: number = null;

    searchText: string;


    @observable
    add_conrol_type_modal: boolean = false

    @action
    setEventMaturityMatrixParameter(response:EventMaturityMatrixParameterPaginationResponse){
        this._eventMaturityMatrixParameter=response.data;
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
    updateEventMaturityMatrixParameter(EventMaturityMatrixParameter: EventMaturityMatrixParameter) {
        const eventMaturityMatrixParameter: EventMaturityMatrixParameter[] = this._eventMaturityMatrixParameter.slice();
        const index: number = eventMaturityMatrixParameter.findIndex(e => e.id == EventMaturityMatrixParameter.id);
        if (index != -1) {
            EventMaturityMatrixParameter[index] = EventMaturityMatrixParameter;
            this._eventMaturityMatrixParameter = eventMaturityMatrixParameter;
        }
    }
    @action
    setIndividualEventMaturityMatrixParameter(eventMaturityMatrixParameter: EventMaturityMatrixParameterSingle) {
       
        this.individualMaturityMatrixParameter = eventMaturityMatrixParameter;
        this.individualLoaded = true;
        
    }

    @computed
    get eventMaturityMatrixParameter(): EventMaturityMatrixParameter[] {
        
        return this._eventMaturityMatrixParameter.slice();
    }

    @action
    getEventMaturityMatrixParameterById(id: number): EventMaturityMatrixParameter {
        return this._eventMaturityMatrixParameter.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedEventMaturityMatrixParameter(eventTypeId: number){
        this.lastInsertedEventMaturityMatrixParameter = eventTypeId;
    }

    get lastInsertedeventMaturityMatrixParameter():number{
        if(this.lastInsertedEventMaturityMatrixParameter) 
            return this.lastInsertedEventMaturityMatrixParameter;
        else 
            return null;
    }
    get individualEventMaturityMatrixParameterId(){
        return this.individualEventMaturityMatrixParameterId;
    } 

}

export const EventMaturityMatrixParameterMasterStore = new Store();