import { observable, action, computed } from "mobx-angular";
import { ChangeRequestItems, ChangeRequestItemsPaginationResponse } from '../../../core/models/masters/event-monitoring/event-change-request-items'

class Store{
    @observable 
    private _changeRequestItems:ChangeRequestItems[]=[];

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
    orderItem: string = 'event_change_request_items.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedEntrance: number = null;

    searchText: string;

    @action
    setChangeRequestItems(response:ChangeRequestItemsPaginationResponse){
        this._changeRequestItems=response.data;
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

    @computed
    get changeRequestItems(): ChangeRequestItems[] {
        return this._changeRequestItems.slice();
    }

}

export const EventChangeRequestItemsStore = new Store();