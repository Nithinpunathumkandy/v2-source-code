import { observable, action, computed } from "mobx-angular";
import {Status,StatusPaginationResponse,StatusSingle} from '../../../core/models/masters/event-monitoring/status';

class Store{
    @observable 
    private _status:Status[]=[];

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
    individualStatus: StatusSingle;

    @observable
    orderItem: string = 'event_statuses.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedStatus: number = null;

    searchText: string;


    @observable
    add_conrol_type_modal: boolean = false

    @action
    setStatus(response:StatusPaginationResponse){
        this._status=response.data;
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
    updateStatus(Status: Status) {
        const status: Status[] = this._status.slice();
        const index: number = status.findIndex(e => e.id == Status.id);
        if (index != -1) {
            Status[index] = Status;
            this._status = status;
        }
    }
    @action
    setIndividualStatus(status: StatusSingle) {
       
        this.individualStatus = status;
        this.individualLoaded = true;
        
    }

    @computed
    get status(): Status[] {
        
        return this._status.slice();
    }

    @action
    getStatusById(id: number): Status {
        return this._status.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedstatus(statusId: number){
        this.lastInsertedStatus = statusId;
    }

    get lastInsertedstatus():number{
        if(this.lastInsertedStatus) 
            return this.lastInsertedStatus;
        else 
            return null;
    }
    get individualStatusId(){
        return this.individualStatus;
    } 

}

export const StatusMasterStore = new Store();