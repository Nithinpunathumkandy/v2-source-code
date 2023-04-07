import { action, computed, observable } from "mobx-angular";
import { EventsSpecification, SpecificationDetails} from "src/app/core/models/event-monitoring/events/events-specification";

class Store {
    @observable
    private _events: EventsSpecification[] = [];

    @observable
    private specification: SpecificationDetails[] = [];

    @observable  
    loaded:boolean=false;

    @observable
    currentPage: number = 1;
    


    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'specification.created_at';

    @observable
    individualLoaded: boolean = false;

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

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setSpecificationList(response) {
        this._events = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }
    

    @computed
    get specificationList():EventsSpecification[]{
        return this._events.slice();
    }

    @action
    unsetEventsList(){
        this._events = [];
        this.currentPage = 1;
        this.loaded = false;
    }

    @action
    setSpecificationDetails(res: SpecificationDetails[]) {       
    this.specification = res;
    this.individualLoaded = true;
    
    }

}

export const EventsSpecificationStore = new Store();