import { observable, action, computed } from "mobx-angular";
import { AssetMaintenanceTypes, AssetMaintenanceTypesPaginationResponse } from "src/app/core/models/masters/asset-management/asset-maintenance-types";

class Store {
    @observable
    private _assetMaintenanceTypes: AssetMaintenanceTypes[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'asset_maintenance_type_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setAssetMaintenanceTypes(response: AssetMaintenanceTypesPaginationResponse) {        
        this._assetMaintenanceTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllAssetMaintenanceTypes(StrategyInitiativeReviewFrequency: AssetMaintenanceTypes[]) {
        this._assetMaintenanceTypes = StrategyInitiativeReviewFrequency;
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
    get allItems(): AssetMaintenanceTypes[] {
        return this._assetMaintenanceTypes.slice();
    }

}

export const AssetMaintenanceTypesMasterStore = new Store();