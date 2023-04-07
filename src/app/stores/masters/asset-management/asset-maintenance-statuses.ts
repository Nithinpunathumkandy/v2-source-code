import { observable, action, computed } from "mobx-angular";
import { AssetMaintenanceStatuses, AssetMaintenanceStatusesPaginationResponse } from "src/app/core/models/masters/asset-management/asset-maintenance-statuses";

class Store {
    @observable
    private _assetMaintenanceStatuses: AssetMaintenanceStatuses[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'asset_maintenance_status_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setAssetCalculationMethod(response: AssetMaintenanceStatusesPaginationResponse) {        
        this._assetMaintenanceStatuses = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllAssetMaintenanceStatuses(AssetMaintenanceStatuses: AssetMaintenanceStatuses[]) {
        this._assetMaintenanceStatuses = AssetMaintenanceStatuses;
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
    get allItems(): AssetMaintenanceStatuses[] {
        return this._assetMaintenanceStatuses.slice();
    }

}

export const AssetMaintenanceStatusesMasterStore = new Store();