import { observable, action, computed } from "mobx-angular";
import {Locations,LocationsPaginationResponse,LocationsSingle} from '../../../core/models/masters/event-monitoring/locations';

class Store{
    @observable 
    private _locations:Locations[]=[];

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
    individualLocations: LocationsSingle;

    @observable
    orderItem: string = 'event_locations.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedLocations: number = null;

    searchText: string;


    @observable
    add_conrol_type_modal: boolean = false

    @action
    setLocations(response:LocationsPaginationResponse){
        this._locations=response.data;
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
    updateLocations(Locations: Locations) {
        const locations: Locations[] = this._locations.slice();
        const index: number = locations.findIndex(e => e.id == Locations.id);
        if (index != -1) {
            Locations[index] = Locations;
            this._locations = locations;
        }
    }
    @action
    setIndividualLocations(locations: LocationsSingle) {
       
        this.individualLocations = locations;
        this.individualLoaded = true;
        
    }

    @computed
    get locations(): Locations[] {
        
        return this._locations.slice();
    }

    @action
    getLocationsById(id: number): Locations {
        return this._locations.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedlocations(locationsId: number){
        this.lastInsertedLocations = locationsId;
    }

    get lastInsertedlocations():number{
        if(this.lastInsertedLocations) 
            return this.lastInsertedLocations;
        else 
            return null;
    }
    get individualLocationsId(){
        return this.individualLocations;
    } 

}

export const LocationsMasterStore = new Store();