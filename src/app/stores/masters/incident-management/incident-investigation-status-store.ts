import { observable, action, computed } from "mobx-angular";
import { IncidentInvestigationStatus, IncidentInvestigationStatusPaginationResponse } from "src/app/core/models/masters/incident-management/incident-investigation-status";

class Store {
    @observable
    private _incidentInvestigationStatus: IncidentInvestigationStatus[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'incident_investigation_status.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setIncidentInvestigationStatus(response: IncidentInvestigationStatusPaginationResponse) {        
        this._incidentInvestigationStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
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
    get allItems(): IncidentInvestigationStatus[] {
        return this._incidentInvestigationStatus.slice();
    }

}

export const IncidentInvestigationStatusMasterStore = new Store();