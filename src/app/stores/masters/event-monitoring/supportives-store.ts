import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { Supportives, SupportivesPaginationResponse } from "src/app/core/models/masters/event-monitoring/supportives";


class Store {
    @observable
    private _Supportives: Supportives[] = [];

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
    orderItem: string = 'event_supportives.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    searchText: string;

    @action
    setSupportives(response: SupportivesPaginationResponse) {

        this._Supportives = response.data;
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
    updateSupportives(type: Supportives) {
        const types: Supportives[] = this._Supportives.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._Supportives = types;
        }
    }

    @computed
    get Supportives(): Supportives[] {

        return this._Supportives.slice();
    }
    @computed
    get allItems(): Supportives[] {

        return this._Supportives.slice();
    }

    @action
    getSupportivesById(id: number): Supportives {
        return this._Supportives.slice().find(e => e.id == id);
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

export const SupportivesMasterStore = new Store();