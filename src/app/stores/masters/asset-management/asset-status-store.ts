import { observable, action, computed } from "mobx-angular";
import { AssetStatus, AssetStatusPaginationResponse } from "src/app/core/models/masters/asset-management/asset-status";


class Store {
    @observable
    private _assetStatus: AssetStatus[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'asset_status_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setAssetStatus(response: AssetStatusPaginationResponse) {
        
        this._assetStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllAssetStatus(status: AssetStatus[]) {
       
        this._assetStatus = status;
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
    get allItems(): AssetStatus[] {
        return this._assetStatus.slice();
    }

}

export const AssetStatusStore = new Store();