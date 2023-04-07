import { observable, action, computed } from "mobx-angular";
import {Periodicity,PeriodicityPaginationResponse,PeriodicitySingle} from '../../../core/models/masters/event-monitoring/periodicity'

class Store{
    @observable 
    private _periodicity:Periodicity[]=[];

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
    individualPeriodicity: PeriodicitySingle;

    @observable
    orderItem: string = 'event_periodicities.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedPeriodicity: number = null;

    searchText: string;


    @observable
    add_conrol_type_modal: boolean = false

    @action
    setPeriodicity(response:PeriodicityPaginationResponse){
        this._periodicity=response.data;
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
    updatePeriodicity(Periodicity: Periodicity) {
        const periodicity: Periodicity[] = this._periodicity.slice();
        const index: number = periodicity.findIndex(e => e.id == Periodicity.id);
        if (index != -1) {
            Periodicity[index] = Periodicity;
            this._periodicity = periodicity;
        }
    }
    @action
    setIndividualPeriodicity(periodicity: PeriodicitySingle) {
       
        this.individualPeriodicity = periodicity;
        this.individualLoaded = true;
        
    }

    @computed
    get periodicity(): Periodicity[] {
        
        return this._periodicity.slice();
    }

    @action
    getPeriodicityById(id: number): Periodicity {
        return this._periodicity.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedperiodicity(periodicityId: number){
        this.lastInsertedPeriodicity = periodicityId;
    }

    get lastInsertedperiodicity():number{
        if(this.lastInsertedPeriodicity) 
            return this.lastInsertedPeriodicity;
        else 
            return null;
    }
    get individualPeriodicityId(){
        return this.individualPeriodicity;
    } 

}

export const PeriodicityMasterStore = new Store();