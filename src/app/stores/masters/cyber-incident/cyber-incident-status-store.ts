import { observable, action, computed } from "mobx-angular";
import { CyberIncidentStatuses, CyberIncidentStatusesPaginationResponse } from "src/app/core/models/masters/cyber-incident/cyber-incident-status";

class Store {
    @observable
    private _cyberIncidentStatuses: CyberIncidentStatuses[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'cyber_incident_status_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setCyberIncidentStatus(response: CyberIncidentStatusesPaginationResponse) {        
        this._cyberIncidentStatuses = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllCyberIncidentStatuses(CyberIncidentStatuses: CyberIncidentStatuses[]) {
        this._cyberIncidentStatuses = CyberIncidentStatuses;
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
    get allItems(): CyberIncidentStatuses[] {
        return this._cyberIncidentStatuses.slice();
    }

}

export const CyberIncidentStatusMasterStore = new Store();