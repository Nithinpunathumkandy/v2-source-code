
import { observable, action, computed } from "mobx-angular";

import { IncidentDamageTypes,IncidentDamageTypesPaginationResponse } from 'src/app/core/models/masters/incident-management/incident-damage-type';


class Store {
    @observable
    private _incidentDamageTypes: IncidentDamageTypes[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;z

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'incident_damage_types.created_at';

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
    setIncidentDamageTypes(response: IncidentDamageTypesPaginationResponse) {
        

        this._incidentDamageTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllIncidentDamageTypes(incidentDamageTypes: IncidentDamageTypes[]) {
       
        this._incidentDamageTypes = incidentDamageTypes;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): IncidentDamageTypes[] {
        
        return this._incidentDamageTypes.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getIncidentDamageTypesById(id: number): IncidentDamageTypes {
        return this._incidentDamageTypes.slice().find(e => e.id == id);
    }
  
}

export const IncidentDamageTypeMasterStore = new Store();

