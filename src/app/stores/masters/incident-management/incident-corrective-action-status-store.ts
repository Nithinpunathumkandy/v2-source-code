import { observable, action, computed } from "mobx-angular";
import { IncidentCorrectiveActionStatus, IncidentCorrectiveActionStatusPaginationResponse } from "src/app/core/models/masters/incident-management/incident-corrective-action-status";

class Store {
    @observable
    private _incidentCorrectiveActionStatus: IncidentCorrectiveActionStatus[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'incident_corrective_action_status_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setIncidentCorrectiveActionStatus(response: IncidentCorrectiveActionStatusPaginationResponse) {        
        this._incidentCorrectiveActionStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllIncidentCorrectiveActionStatus(IncidentCorrectiveActionStatus: IncidentCorrectiveActionStatus[]) {
        this._incidentCorrectiveActionStatus = IncidentCorrectiveActionStatus;
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
    get allItems(): IncidentCorrectiveActionStatus[] {
        return this._incidentCorrectiveActionStatus.slice();
    }

}

export const IncidentCorrectiveActionStatusMasterStore = new Store();