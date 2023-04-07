
import { observable, action, computed } from "mobx-angular";

import { IncidentTypes , IncidentTypesPaginationResponse} from 'src/app/core/models/masters/incident-management/incident-type'

class Store {
    @observable
    private _incidentTypes: IncidentTypes[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;z

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'incident_types.created_at';

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
    setIncidentTypes(response: IncidentTypesPaginationResponse) {
        

        this._incidentTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllIncidentTypes(incidentTypes: IncidentTypes[]) {
       
        this._incidentTypes = incidentTypes;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): IncidentTypes[] {
        
        return this._incidentTypes.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getIncidentTypesById(id: number): IncidentTypes {
        return this._incidentTypes.slice().find(e => e.id == id);
    }
  
}
export const IncidentTypeMasterStore = new Store();


