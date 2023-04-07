import { observable, action, computed } from "mobx-angular";
import { CustomerComplaintSource, CustomerComplaintSourcePaginationResponse } from "src/app/core/models/masters/customer-engagement/customer-complaint-source";

class Store {
    @observable
    private _customerComplaintSource: CustomerComplaintSource[] = [];

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
    orderItem: string = 'customer_complaint_sources.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setCustomerComplaintSource(response: CustomerComplaintSourcePaginationResponse) {

        this._customerComplaintSource = response.data;
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
    updateCustomerComplaintSource(type: CustomerComplaintSource) {
        const types: CustomerComplaintSource[] = this._customerComplaintSource.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._customerComplaintSource = types;
        }
    }

    @computed
    get CustomerComplaintSource(): CustomerComplaintSource[] {

        return this._customerComplaintSource.slice();
    }
    @computed
    get allItems(): CustomerComplaintSource[] {

        return this._customerComplaintSource.slice();
    }

    @action
    getCustomerComplaintSourceById(id: number): CustomerComplaintSource {
        return this._customerComplaintSource.slice().find(e => e.id == id);
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

export const CustomerComplaintSourceMasterStore = new Store();