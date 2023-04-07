import { action, computed, observable } from "mobx-angular";
import { EventChecklistPaginationResponse, EventChecklist, IndividualEventChecklist , Checklist } from "src/app/core/models/event-monitoring/events/event-checklist";
import { Image } from "src/app/core/models/image.model";

class Store {
    
    @observable
    private _eventChecklist: EventChecklist[] = [];

    @observable
    loaded: boolean = false;

    @observable
    routeMainListing: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    lastInsertedEventChecklist: number = null;

    @observable
    orderItem: string = 'event_closure.title';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    private _documentDetails: Image = null;

    @observable
    searchText: string;

    @observable
    _individualEventChecklist = null;

    @action
    setEventChecklist(response: EventChecklistPaginationResponse) {
        this._eventChecklist = response.data;
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
    clearDocumentDetails() {
        this._documentDetails = null;
    }

    @action
    setDocumentDetails(details: Image, url: string) {
        this._documentDetails = details;
    }

    @action
    unsetDocumentDetails(token?: string) {
        if (this._documentDetails.hasOwnProperty('is_new')) {
            this._documentDetails = null;
        }
        else {
            this._documentDetails['is_deleted'] = true;
        }
    }

    @computed
    get docDetails(): Image {
        return this._documentDetails;
    }

    @computed
    get EventChecklist(): EventChecklist[] {
        return this._eventChecklist.slice();
    }

    @computed
    get allItems(): EventChecklist[] {
        return this._eventChecklist.slice();
    }

    @action
    setLastInsertedEventChecklist(eventClosureId: number) {
        this.lastInsertedEventChecklist = eventClosureId;
    }

    get lastInsertedeventClosure(): number {
        if (this.lastInsertedEventChecklist)
            return this.lastInsertedEventChecklist;
        else
            return null;
    }

    @action
    setIndividualEventChecklist(individual: IndividualEventChecklist) {
        this._individualEventChecklist = individual;
    }

    @action
    unsetIndividualEventChecklist() {
        this._individualEventChecklist = null;
        this.routeMainListing = false;
    }

    get individualEventChecklist() {
        return this._individualEventChecklist
    }

    @action
    setRouteMainListing() {
        this.routeMainListing = true;
    }

    @action
    unsetEventChecklist() {
        this._eventChecklist = [];
        this.currentPage = 1;
        this.loaded = false;
        this.orderBy = 'desc';
        this.orderItem = 'event_closure.title';
    }

}

export const EventChecklistStore = new Store();