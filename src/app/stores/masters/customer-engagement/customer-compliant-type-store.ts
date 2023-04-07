
import { observable, action, computed } from "mobx-angular";
import { CustomerType, CustomerTypePaginationResponse } from "src/app/core/models/masters/customer-engagement/customer-compliant-type";


class Store {
    @observable
    private _customerType: CustomerType[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'customer_compliant_types.created_at';

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
    setCustomerType(response: CustomerTypePaginationResponse) {
        this._customerType = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true; 
    }


    @computed
    get allItems(): CustomerType[] {        
        return this._customerType.slice();
    }

  
}

export const CustomerTypeMasterStore = new Store();

