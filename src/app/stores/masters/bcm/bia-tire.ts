import { observable, action, computed } from "mobx-angular";
import { BiaTire, BiaTireDetails, BiaTirePaginationResponse } from "src/app/core/models/masters/bcm/bia-tire";

class Store {
    @observable
    private _biaTire: BiaTire[] = [];

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
    orderItem: string = 'bia_tier.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    biaTireDetails:BiaTireDetails;

    searchText: string;

    @action
    setBiaTire(response: BiaTirePaginationResponse) {

        this._biaTire = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setAllBiaTire(res: BiaTire[]) {
        this._biaTire = res;
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
    updateBiaTire(type: BiaTireDetails) {
     this.biaTireDetails=type    
    }  

    @computed
    get BiaTire(): BiaTire[] {

        return this._biaTire.slice();
    }
    @computed
    get allItems(): BiaTire[] {

        return this._biaTire.slice();
    }

    @action
    getBiaTireById(id: number): BiaTire {
        return this._biaTire.slice().find(e => e.id == id);
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

export const BiaTireMasterStore = new Store();