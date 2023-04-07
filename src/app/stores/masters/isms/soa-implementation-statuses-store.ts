import { observable, action, computed } from "mobx-angular";
import { SoaImplementationStatuses, SoaImplementationStatusesPaginationResponse } from "src/app/core/models/masters/isms/soa-implementation-statuses";


class Store {
    @observable
    private _soaImplementationStatuses: SoaImplementationStatuses[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualSoaImplementationStatuses: SoaImplementationStatuses;

    @observable
    individualLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    lastInsertedId: number = null;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'soa_implementation_statuses.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setSoaImplementationStatuses(response: SoaImplementationStatusesPaginationResponse) {
        
        this._soaImplementationStatuses = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllSoaImplementationStatuses(soaImplementationStatuses: SoaImplementationStatuses[]) {
       
        this._soaImplementationStatuses = soaImplementationStatuses;
        this.loaded = true;
        
    }

    @action
    setIndividualSoaImplementationStatuses(soaImplementationStatuses: SoaImplementationStatuses) {
       
        this.individualSoaImplementationStatuses = soaImplementationStatuses;
        this.individualLoaded = true;
        
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
    get allItems(): SoaImplementationStatuses[] {
        return this._soaImplementationStatuses.slice();
    }

    @action
    updateSoaImplementationStatuses(type: SoaImplementationStatuses) {
        const types: SoaImplementationStatuses[] = this._soaImplementationStatuses.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._soaImplementationStatuses=types;
        }
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getSoaImplementationStatusesById(id: number): SoaImplementationStatuses {
        return this._soaImplementationStatuses.slice().find(e => e.id == id);
    }

    get individualSoaImplementationStatusesId(){
        return this.individualSoaImplementationStatuses;
    } 

}

export const SoaImplementationStatusesMasterStore = new Store();