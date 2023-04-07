
import { observable, action, computed } from "mobx-angular";

import { ByAuditor,ByAuditorPaginationResponse } from 'src/app/core/models/internal-audit/annual-plan/by-auditor/by-auditor';


class Store {
    @observable
    private _byAuditors: ByAuditor[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    individualByAuditorAnnualPlanDetails: ByAuditor;

    @observable
    auditor_first_name: string = '';

    @observable
    auditor_last_name: string = '';

    @observable
    auditor_designation_title: string = '';

    @observable
    auditor_department : string = '';

    @observable
    image_token: string = '';

    @observable
    auditor_user_id: number = null;

    @observable
    individualLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'title';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

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
    setByAuditors(response: ByAuditorPaginationResponse) {
        

        this._byAuditors = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setIndividualByAuditors(auditors: ByAuditor) {
       
        this.individualByAuditorAnnualPlanDetails = auditors;
        this.individualLoaded = true;
        
    }


    @action
    setAllByAuditors(byAuditors: ByAuditor[]) {
       
        this._byAuditors = byAuditors;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): ByAuditor[] {
        
        return this._byAuditors.slice();
    }
    @action
    getByAuditorsById(id: number): ByAuditor {
        return this._byAuditors.slice().find(e => e.id == id);
    }

    get byAuditorDetails() : ByAuditor{
        return this.individualByAuditorAnnualPlanDetails;
    } 
  
}

export const ByAuditorsStore = new Store();

