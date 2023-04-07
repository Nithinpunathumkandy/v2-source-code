import { action, computed, observable } from "mobx-angular";
import { Stakeholder, StakeholderDetails , StakeholderPaginationResponse , Needs , Communications } from 'src/app/core/models/event-monitoring/events/event-stakeholder';

class Store {
    @observable
    private _stakeholder: Stakeholder[] = [];

    @observable
    private _stakeholderDetails:StakeholderDetails

    @observable
    _needs : Needs[]= [];

    @observable
    tempArrayTopLeft=[]

    @observable
    tempArrayBottomLeft=[]
    
    @observable
    tempArrayTopRight=[]

    @observable
    tempArrayBottomRight=[]

    @observable
    _communications : Communications[]=[];

    @observable  
    loaded:boolean=false;

    @observable
    currentPage: number = 1;
    
    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'stakeholder.created_at';

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

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setStakeholderList(response:StakeholderPaginationResponse) {
        this._stakeholder = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }
    
    @computed
    get eventStakeholderList():Stakeholder[]{
        return this._stakeholder.slice();
    }

    @action
    unsetStakeholderList(){
        this._stakeholder = [];
        //this.currentPage = 1;
        this.loaded = false;
    }

    @action
    setIndividualStakeholderDetails(details:StakeholderDetails){
        this.individualLoaded = true;
        this._stakeholderDetails = details;        
    }

    @action
    unsetIndividualStakeholderDetails() {
        this.individualLoaded = false;
        this._stakeholderDetails = null;
    }

    @computed
    get IndividualStakeholderDetails():StakeholderDetails {
        return this._stakeholderDetails;
    }

}

export const EventStakeholderStore = new Store();