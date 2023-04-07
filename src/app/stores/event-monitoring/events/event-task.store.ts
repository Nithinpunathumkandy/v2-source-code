import { action, computed, observable } from "mobx-angular";
import { EventTaskPaginationResponse , EventTask, EventTaskDetails} from "src/app/core/models/event-monitoring/events/event-task";

class Store {
    @observable
    private _eventTask: EventTask[] = [];

    @observable
    private _eventTaskDetails:EventTaskDetails;

    @observable
    routeMainListing: boolean = false;

    @observable  
    loaded:boolean=false;

    @observable
    currentPage: number = null;
    
    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'tasks.created_at';

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

    @observable
    searchText: string;

    @observable
    selectedEventId: number = null;

    @observable
    taskPhaseType:string="Initiation"

    @observable
    taskPhaseId:number=1

    @observable
    taskId:number

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }
    @action
    setRouteMainListing(){
        this.routeMainListing = true;
       
    }

    @action
    setEventTaskList(response:EventTaskPaginationResponse) {
        this._eventTask = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }
    
    @computed
    get eventTaskList():EventTask[]{
        return this._eventTask.slice();
    }

    @action
    unsetEventsList(){
        this._eventTask = [];
        this.loaded = false;
        this.orderBy='desc';
        this.orderItem='tasks.created_at';
    }

    @action
    setIndividualEventTaskDetails(details:EventTaskDetails){
        this.individualLoaded = true;
        this._eventTaskDetails = details;        
    }

    @action
    unsetIndividualEventTaskDetails() {
        this.individualLoaded = false;
        this._eventTaskDetails = null;
        this.routeMainListing=false;
    }

    @computed
    get IndividualEventTaskDetails():EventTaskDetails {
        return this._eventTaskDetails;
    }

}

export const EventTaskStore = new Store();