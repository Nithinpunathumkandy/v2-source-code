
import { observable, action, computed } from "mobx-angular";

import { IncidentDamageSeverity,IncidentDamageSeverityPaginationResponse } from 'src/app/core/models/masters/incident-management/incident-damage-severity';


class Store {
    @observable
    private _incidentDamageSeverity: IncidentDamageSeverity[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;z

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'incident_damage_severity.created_at';

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
    setIncidentDamageSeverity(response: IncidentDamageSeverityPaginationResponse) {
        

        this._incidentDamageSeverity = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllIncidentDamageSeverity(incidentDamageSeverity: IncidentDamageSeverity[]) {
       
        this._incidentDamageSeverity = incidentDamageSeverity;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): IncidentDamageSeverity[] {
        
        return this._incidentDamageSeverity.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getIncidentDamageSeverityId(id: number): IncidentDamageSeverity {
        return this._incidentDamageSeverity.slice().find(e => e.id == id);
    }
  
}

export const IncidentDamageSeverityMasterStore = new Store();

