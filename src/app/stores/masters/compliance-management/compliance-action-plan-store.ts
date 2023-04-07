
import { observable, action, computed } from "mobx-angular";
import { ComplianceActionPlanStatus, ComplianceActionPlanPaginationResponse } from "src/app/core/models/masters/compliance-management/compliance-action-plan-status";




class Store {
    @observable
    private _complianceActionPlanStatus: ComplianceActionPlanStatus[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'business_assessment_status_language.created_at';

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
    setComplianceActionPlanStatus(response: ComplianceActionPlanPaginationResponse) {
        this._complianceActionPlanStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true; 
    }


    @computed
    get allItems(): ComplianceActionPlanStatus[] {        
        return this._complianceActionPlanStatus.slice();
    }

  
}

export const ComplianceActionPlanStore = new Store();

