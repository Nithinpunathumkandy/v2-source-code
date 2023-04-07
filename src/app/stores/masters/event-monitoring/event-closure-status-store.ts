import { observable, action, computed } from "mobx-angular";
import { EventClosureStatus, EventClosureStatusPaginationResponse } from "src/app/core/models/masters/event-monitoring/event-closure-status";


class Store {
    @observable
    private _eventClosureStatus: EventClosureStatus[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'event_closure_statuses.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    searchText: string;

    @action
    setEventClosureStatus(response: EventClosureStatusPaginationResponse) {        
        this._eventClosureStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
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
    get allItems(): EventClosureStatus[] {
        return this._eventClosureStatus.slice();
    }

}

export const EventClosureStatusMasterStore = new Store();