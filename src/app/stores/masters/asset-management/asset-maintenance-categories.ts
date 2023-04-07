import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { any } from "@amcharts/amcharts4/.internal/core/utils/Array";
import { AssetMaintenanceCategories, AssetMaintenanceCategoriesPaginationResponse } from "src/app/core/models/masters/asset-management/asset-maintenance-categories";

class Store {
    @observable
    private _assetMaintenanceCategories: AssetMaintenanceCategories[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'asset_maintenance_categories.created_at';

    @observable
    from: number = null;

    @observable
    lastInsertedId: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    AssetMaintenanceCategoriesDetails :any;

    searchText: string;

    @action
    setAssetMaintenanceCategories(response: AssetMaintenanceCategoriesPaginationResponse) {
        
        this._assetMaintenanceCategories = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllAssetMaintenanceCategories(AssetMaintenanceCategories: AssetMaintenanceCategories[]) {
       
        this._assetMaintenanceCategories = AssetMaintenanceCategories;
        this.loaded = true;
        
    }

    @action
    updateAssetMaintenanceCategories(type: AssetMaintenanceCategories) {
        // const types: BusinessApplications[] = this._businessApplications.slice();
        // const index: number = types.findIndex(e => e.id == type.id);
        // if (index != -1) {
        //     types[index] = type;
        //     this._businessApplications = types;
        // }
        this.AssetMaintenanceCategoriesDetails=type
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
    get allItems(): AssetMaintenanceCategories[] {
        return this._assetMaintenanceCategories.slice();
    }

    @action
    setLastInsertedId(id: number) {
        this.lastInsertedId = id;
    }

    get LastInsertedId(): number {
        if (this.lastInsertedId)
            return this.lastInsertedId;
        else
            return null;
    }

}

export const AssetMaintenanceCategoriesMasterStore = new Store();