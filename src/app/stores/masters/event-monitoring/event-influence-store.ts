import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { EventInfluence, EventInfluencePaginationResponse } from "src/app/core/models/masters/event-monitoring/event-influence";

class Store {
    @observable
    private _EventInfluence: EventInfluence[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    lastInsertedId: number = null;

    @observable
    orderItem: string = 'event_influences.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    searchText: string;

    @action
    setEventInfluence(response: EventInfluencePaginationResponse) {

        this._EventInfluence = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }


    @action
    updateEventInfluence(type: EventInfluence) {
        const types: EventInfluence[] = this._EventInfluence.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._EventInfluence = types;
        }
    }

    @computed
    get EventInfluence(): EventInfluence[] {

        return this._EventInfluence.slice();
    }
    @computed
    get allItems(): EventInfluence[] {

        return this._EventInfluence.slice();
    }

    @action
    getEventInfluenceById(id: number): EventInfluence {
        return this._EventInfluence.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedId(id: number) {
        this.lastInsertedId = id;
    }

    get LastInsertedId(): number {
        if (this.lastInsertedId)
            return this.lastInsertedId;
        else
            return null;
    }

}

export const EventInfluenceMasterStore = new Store();