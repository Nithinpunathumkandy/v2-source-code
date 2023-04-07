
import { observable, action, computed } from "mobx-angular";
import { CustomerComplaintActionPlanStatuses, CustomerComplaintActionPlanStatusesPaginationResponse } from "../../../core/models/masters/customer-engagement/customer-complaint-action-plan-statuses";


class Store {
    @observable
    private _customerComplaintActionPlanStatuses: CustomerComplaintActionPlanStatuses[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'customer_complaint_action_plan_status_language.created_at';

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
    setCustomerComplaintActionPlanStatuses(response: CustomerComplaintActionPlanStatusesPaginationResponse) {
        this._customerComplaintActionPlanStatuses = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true; 
    }


    @computed
    get allItems(): CustomerComplaintActionPlanStatuses[] {        
        return this._customerComplaintActionPlanStatuses.slice();
    }

  
}

export const CustomerComplaintActionPlanStatusesMasterStore = new Store();

