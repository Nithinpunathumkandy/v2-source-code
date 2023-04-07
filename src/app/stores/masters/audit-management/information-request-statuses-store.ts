import { action, computed, observable } from "mobx-angular";
import { InformationRequestStatus, InformationRequestStatusPaginationResponse } from "src/app/core/models/masters/audit-management/information-request-status";

class Store{
    @observable
    private _informationRequestStatus: InformationRequestStatus[] = []

    
    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;


    //add tab;e name here
    @observable
    orderItem: string = 'am-audit-information-request-statuses.created_at';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;
    
    searchText: string;

    @observable
    individualLoaded: boolean = false;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setInformationRequestStatus(response: InformationRequestStatusPaginationResponse) {
        this._informationRequestStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true; 
    }

    @action
    setAllInformationRequestStatus(type: InformationRequestStatus[]) {
        this._informationRequestStatus = type;
        this.loaded = true;
    }

    
    @computed
    get allItems(): InformationRequestStatus[] {        
        return this._informationRequestStatus.slice();
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }
}
export const InformationRequestStatusMasterStore = new Store();