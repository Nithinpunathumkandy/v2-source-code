
import { observable, action, computed } from "mobx-angular";
import {  EventDocumentsPaginationResponse, IndividualEventDocument,EventDocument } from 'src/app/core/models/event-monitoring/event-document';


class Store {
    @observable
    private _projectDocument: EventDocument[] = [];

    @observable
    private _individualEventDocument: IndividualEventDocument;

    @observable  
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'project_document_title.created_at';

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
    lastInsertedId: number = null;

    @observable
    preview_url: string;

    @observable
    searchText: string;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setEventDocument(response: EventDocumentsPaginationResponse) {
        this._projectDocument = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }


    @action
    setIndividualEventDocument(indivitual: IndividualEventDocument) {       
    this._individualEventDocument = indivitual;
    this.individualLoaded = true;
    
    }

    @computed
    get allItems(): EventDocument[] {
        return this._projectDocument.slice();
    }

    @computed
    get indivitualEventDocument(){
        return this._individualEventDocument
    }

    @action
    unsetIndivitualEventDocument() {       
        this._individualEventDocument = null;
        this.individualLoaded = false;   
    }
  
}


export const EventDocumentStore = new Store();

