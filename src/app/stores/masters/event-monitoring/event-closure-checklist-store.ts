import { observable, action, computed } from "mobx-angular";
import {EventClosureChecklist,EventClosureChecklistPaginationResponse,EventClosureChecklistSingle} from '../../../core/models/masters/event-monitoring/event-closure-checklist'

class Store{
    @observable 
    private _eventClosureChecklist:EventClosureChecklist[]=[];

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
    individualEventClosureChecklist: EventClosureChecklistSingle;

    @observable
    orderItem: string = 'event_closure_checklists.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedEventClosureChecklist: number = null;

    searchText: string;


    @observable
    add_conrol_type_modal: boolean = false

    @action
    setEventClosureChecklist(response:EventClosureChecklistPaginationResponse){
        this._eventClosureChecklist=response.data;
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
    updateEventClosureChecklist(EventClosureChecklist: EventClosureChecklist) {
        const eventClosureChecklist: EventClosureChecklist[] = this._eventClosureChecklist.slice();
        const index: number = eventClosureChecklist.findIndex(e => e.id == EventClosureChecklist.id);
        if (index != -1) {
            EventClosureChecklist[index] = EventClosureChecklist;
            this._eventClosureChecklist = eventClosureChecklist;
        }
    }
    @action
    setIndividualEventClosureChecklist(eventClosureChecklist: EventClosureChecklistSingle) {
       
        this.individualEventClosureChecklist = eventClosureChecklist;
        this.individualLoaded = true;
        
    }

    @computed
    get eventClosureChecklist(): EventClosureChecklist[] {
        
        return this._eventClosureChecklist.slice();
    }

    @action
    getEventClosureChecklistById(id: number): EventClosureChecklist {
        return this._eventClosureChecklist.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedeventClosureChecklist(eventClosureChecklistId: number){
        this.lastInsertedEventClosureChecklist = eventClosureChecklistId;
    }

    get lastInsertedeventClosureChecklist():number{
        if(this.lastInsertedEventClosureChecklist) 
            return this.lastInsertedEventClosureChecklist;
        else 
            return null;
    }
    get individualEventClosureChecklistId(){
        return this.individualEventClosureChecklist;
    } 

}

export const EventClosureChecklistMasterStore = new Store();