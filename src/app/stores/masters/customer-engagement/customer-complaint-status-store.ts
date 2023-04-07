
import { observable, action, computed } from "mobx-angular";
import { CustomerCompliantStatus, CustomerCompliantStatusPaginationResponse } from "src/app/core/models/masters/customer-engagement/customer-complaint-status";



class Store {
    @observable
    private _customerCompliantStatus: CustomerCompliantStatus[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'customer_complaint_status_language.created_at';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';
    
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
    setCustomerCompliantStatus(response: CustomerCompliantStatusPaginationResponse) {
        this._customerCompliantStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true; 
    }


    @computed
    get allItems(): CustomerCompliantStatus[] {        
        return this._customerCompliantStatus.slice();
    }

  
}

export const CustomerCompliantStatusMasterStore = new Store();

