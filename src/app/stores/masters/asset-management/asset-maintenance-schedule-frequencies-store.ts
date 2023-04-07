import { observable, action, computed } from "mobx-angular";
import { AssetMaintenanceScheduleFrequencies, AssetMaintenanceScheduleFrequenciesPaginationResponse } from "src/app/core/models/masters/asset-management/asset-maintenance-schedule-frequencies";

class Store {
    @observable
    private _assetMaintenanceScheduleFrequencies: AssetMaintenanceScheduleFrequencies[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'asset_maintenance_schedule_frequency_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setAssetMaintenanceScheduleFrequencies(response: AssetMaintenanceScheduleFrequenciesPaginationResponse) {        
        this._assetMaintenanceScheduleFrequencies = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllAssetMaintenanceScheduleFrequencies(AssetMaintenanceScheduleFrequencies: AssetMaintenanceScheduleFrequencies[]) {
        this._assetMaintenanceScheduleFrequencies = AssetMaintenanceScheduleFrequencies;
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
    get allItems(): AssetMaintenanceScheduleFrequencies[] {
        return this._assetMaintenanceScheduleFrequencies.slice();
    }

}

export const AssetMaintenanceScheduleFrequenciesMasterStore = new Store();