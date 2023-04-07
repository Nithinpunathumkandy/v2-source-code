import { observable, action, computed } from "mobx-angular";
import { EventChangeRequestStatus, EventChangeRequestStatusPaginationResponse } from "src/app/core/models/masters/event-monitoring/event-change-request-status";


class Store {
    @observable
    private _eventChangeRequestStatus: EventChangeRequestStatus[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'event_change_request_statuses.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    searchText: string;

    @action
    setEventChangeRequestStatus(response: EventChangeRequestStatusPaginationResponse) {        
        this._eventChangeRequestStatus = response.data;
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
    get allItems(): EventChangeRequestStatus[] {
        return this._eventChangeRequestStatus.slice();
    }

}

export const EventChaneRequestStatusMasterStore = new Store();