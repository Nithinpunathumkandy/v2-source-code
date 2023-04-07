import { observable, action, computed } from "mobx-angular";
import { BusinessContinuityPlanStatus, BusinessContinuityPlanStatusPaginationResponse } from "src/app/core/models/masters/bcm/business-continuity-plan-status";

class Store {
    @observable
    private _businessContinuityPlanStatus: BusinessContinuityPlanStatus[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'business_continuity_plan_status_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setBusinessContinuityPlanStatus(response: BusinessContinuityPlanStatusPaginationResponse) {        
        this._businessContinuityPlanStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllBusinessContinuityPlanStatus(BusinessContinuityPlanStatus: BusinessContinuityPlanStatus[]) {
        this._businessContinuityPlanStatus = BusinessContinuityPlanStatus;
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
    get allItems(): BusinessContinuityPlanStatus[] {
        return this._businessContinuityPlanStatus.slice();
    }

}

export const BusinessContinuityPlanStatusMasterStore = new Store();