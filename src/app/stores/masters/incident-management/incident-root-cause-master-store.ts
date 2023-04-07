
import { observable, action, computed } from "mobx-angular";

import { IncidentRootCause,IncidentRootCausePaginationResponse } from 'src/app/core/models/masters/incident-management/incident-root-cause';


class Store {
    @observable
    private _incidentRootCause: IncidentRootCause[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;z

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'incident_root_cause.created_at';

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
    setIncidentRootCause(response: IncidentRootCausePaginationResponse) {
        

        this._incidentRootCause = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllIncidentRootCause(incidentRootCause: IncidentRootCause[]) {
       
        this._incidentRootCause = incidentRootCause;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): IncidentRootCause[] {
        
        return this._incidentRootCause.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getIncidentRootCauseById(id: number): IncidentRootCause {
        return this._incidentRootCause.slice().find(e => e.id == id);
    }
  
}

export const IncidentRootCauseMasterStore = new Store();

