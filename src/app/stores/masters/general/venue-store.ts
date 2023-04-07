import { observable, action, computed } from "mobx-angular";
import { Venue,VenuePaginationResponse } from 'src/app/core/models/masters/general/venue';

class Store {
    @observable
    private _venue: Venue[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualVenue: Venue;

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
    orderItem: string = 'venues';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    searchText: string;

    @observable
    lastTitle:string="";

    @action
    setVenue(response: VenuePaginationResponse) {
        
        this._venue = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllVenue(venue: Venue[]) {
       
        this._venue = venue;
        this.loaded = true;
        
    }

    @action
    setIndividualVenue(venue: Venue) {
       
        this.individualVenue = venue;
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
    get allItems(): Venue[] {
        return this._venue.slice();
    }

    getVenueById(id: number):Venue{
        return this._venue.slice().find(e => e.id == id);
    }
    

    @action
    setLastInsertedId(id: number,title: string){
        this.lastInsertedId = id;
        this.lastTitle= title;
    }


    get individualVenueId(){
        return this.individualVenue;
    } 

}

export const VenueMasterStore = new Store();