import { observable, action, computed } from "mobx-angular";
import { CyberIncidentCorrectiveActionStatuses, CyberIncidentCorrectiveActionStatusesPaginationResponse } from "src/app/core/models/masters/cyber-incident/cyber-incident-corrective-action-status";

class Store {
    @observable
    private _cyberIncidentCorrectiveActionStatuses: CyberIncidentCorrectiveActionStatuses[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'cyber_incident_corrective_action_status_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setCyberIncidentCorrectiveActionStatus(response: CyberIncidentCorrectiveActionStatusesPaginationResponse) {        
        this._cyberIncidentCorrectiveActionStatuses = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllCyberIncidentCorrectiveActionStatuses(CyberIncidentStatuses: CyberIncidentCorrectiveActionStatuses[]) {
        this._cyberIncidentCorrectiveActionStatuses = CyberIncidentStatuses;
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
    get allItems(): CyberIncidentCorrectiveActionStatuses[] {
        return this._cyberIncidentCorrectiveActionStatuses.slice();
    }

}

export const CyberIncidentCorrectiveActionStatusMasterStore = new Store();