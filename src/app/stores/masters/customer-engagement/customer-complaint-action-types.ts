import { observable, action, computed } from "mobx-angular";
import { CustomerComplaintActionTypes, CustomerComplaintActionTypesPaginationResponse } from "src/app/core/models/masters/customer-engagement/customer-complaint-action-types";

class Store {
    @observable
    private _customerComplaintActionTypes: CustomerComplaintActionTypes[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'customer_complaint_action_types_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setCustomerComplaintActionTypes(response: CustomerComplaintActionTypesPaginationResponse) {        
        this._customerComplaintActionTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllCustomerComplaintActionTypes(CustomerComplaintActionTypes: CustomerComplaintActionTypes[]) {
        this._customerComplaintActionTypes = CustomerComplaintActionTypes;
        this.loaded = true;
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
    get allItems(): CustomerComplaintActionTypes[] {
        return this._customerComplaintActionTypes.slice();
    }

}

export const CustomerComplaintActionTypesMasterStore = new Store();