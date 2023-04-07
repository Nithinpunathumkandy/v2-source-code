import { observable, action, computed } from "mobx-angular";
import { BCPChangeRequestTypes, BCPChangeRequestTypesPaginationResponse } from "src/app/core/models/masters/bcm/bcp-change-request-types";

class Store {
    @observable
    private _bcpChangeRequestTypes: BCPChangeRequestTypes[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'business_continuity_plan_change_request_type_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setBCPChangeRequestTypes(response: BCPChangeRequestTypesPaginationResponse) {        
        this._bcpChangeRequestTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllBCPChangeRequestTypes(BCPChangeRequestTypes: BCPChangeRequestTypes[]) {
        this._bcpChangeRequestTypes = BCPChangeRequestTypes;
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
    get allItems(): BCPChangeRequestTypes[] {
        return this._bcpChangeRequestTypes.slice();
    }

}

export const BCPChangeRequestTypeMasterStore = new Store();