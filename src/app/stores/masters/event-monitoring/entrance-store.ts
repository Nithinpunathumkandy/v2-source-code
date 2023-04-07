import { observable, action, computed } from "mobx-angular";
import {Entrance,EntrancePaginationResponse,EntranceSingle} from '../../../core/models/masters/event-monitoring/entrance'

class Store{
    @observable 
    private _entrance:Entrance[]=[];

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
    individualEntrance: EntranceSingle;

    @observable
    orderItem: string = 'event_entrances.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedEntrance: number = null;

    searchText: string;


    @observable
    add_conrol_type_modal: boolean = false

    @action
    setEntrance(response:EntrancePaginationResponse){
        this._entrance=response.data;
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
    updateEntrance(Entrance: Entrance) {
        const entrance: Entrance[] = this._entrance.slice();
        const index: number = entrance.findIndex(e => e.id == Entrance.id);
        if (index != -1) {
            Entrance[index] = Entrance;
            this._entrance = entrance;
        }
    }
    @action
    setIndividualEntrance(entrance: EntranceSingle) {
       
        this.individualEntrance = entrance;
        this.individualLoaded = true;
        
    }

    @computed
    get entrance(): Entrance[] {
        
        return this._entrance.slice();
    }

    @action
    getEntranceById(id: number): Entrance {
        return this._entrance.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedentrance(entranceId: number){
        this.lastInsertedEntrance = entranceId;
    }

    get lastInsertedentrance():number{
        if(this.lastInsertedEntrance) 
            return this.lastInsertedEntrance;
        else 
            return null;
    }
    get individualEntranceId(){
        return this.individualEntrance;
    } 

}

export const EntranceMasterStore = new Store();