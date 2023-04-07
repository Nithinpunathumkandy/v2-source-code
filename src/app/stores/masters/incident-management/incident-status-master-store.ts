
import { observable, action, computed } from "mobx-angular";

import { IncidentStatus,IncidentStatusPaginationResponse } from 'src/app/core/models/masters/incident-management/incident-status';


class Store {
    @observable
    private _incidentStatus: IncidentStatus[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;z

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'incident_status.created_at';

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
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setIncidentStatus(response: IncidentStatusPaginationResponse) {
        

        this._incidentStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllIncidentStatus(incidentCategories: IncidentStatus[]) {
       
        this._incidentStatus = incidentCategories;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): IncidentStatus[] {
        
        return this._incidentStatus.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getIncidentStatusById(id: number): IncidentStatus {
        return this._incidentStatus.slice().find(e => e.id == id);
    }
  
}

export const IncidentStatusMasterStore = new Store();

