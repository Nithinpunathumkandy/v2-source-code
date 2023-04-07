import { action, computed, observable } from "mobx-angular";
import { EventMappingResponse,EventMapping } from 'src/app/core/models/event-monitoring/events/event-mapping';
class Store {
    @observable
    private _mappingList: EventMapping[] = [];;

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    orderItem: string = 'title';


    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;
    
    @observable
    last_page: number = null;

    @observable
    riskId: number = null;


    @observable
    selected: number = null;

    @observable
    searchText: string;

    @observable
    risk_select_form_modal: boolean = false;


    @observable
    projects=[];
    
    @observable
    locations=[];

    @observable
    products=[];

    @observable
    controls=[];

    @observable
    customers=[];

    @observable
    objectives=[];

    @observable
    focusAreas=[];

    @observable
    assets=[];


    @observable
    saveSelected: boolean=false;

    @observable
    mappingItemsLoaded:boolean=false

  
    @action
    setMappingDetails(response: EventMappingResponse) {
        this._mappingList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.mappingItemsLoaded=true
    }

    @action
    unsetMappingDetails() {
        this._mappingList = [];
        this.mappingItemsLoaded = false;
    }


    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @computed
    get mappingItemList(): any {
        return this._mappingList;
    }

}

export const EventMappingStore = new Store();