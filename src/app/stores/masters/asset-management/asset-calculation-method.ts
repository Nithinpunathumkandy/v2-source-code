import { observable, action, computed } from "mobx-angular";
import { AssetCalculationMethod, AssetCalculationMethodPaginationResponse } from "src/app/core/models/masters/asset-management/asset-calculation-method";

class Store {
    @observable
    private _assetCalculationMethod: AssetCalculationMethod[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'asset_calculation_method_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setAssetCalculationMethod(response: AssetCalculationMethodPaginationResponse) {        
        this._assetCalculationMethod = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllAssetCalculationMethod(AssetCalculationMethod: AssetCalculationMethod[]) {
        this._assetCalculationMethod = AssetCalculationMethod;
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
    get allItems(): AssetCalculationMethod[] {
        return this._assetCalculationMethod.slice();
    }

}

export const AssetCalculationMethodMasterStore = new Store();