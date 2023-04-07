import { observable, action, computed } from "mobx-angular";
import { AssetMatrixCategories, AssetMatrixCategoriesPaginationResponse } from "src/app/core/models/masters/asset-management/asset-matrix-categories";

class Store {
    @observable
    private _assetMatrixCategories: AssetMatrixCategories[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'asset_matrix_categories.created_at';

    @observable
    from: number = null;

    @observable
    lastInsertedId: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    AssetMatrixCategoriesDetails :any;

    searchText: string;

    @action
    setAssetMatrixCategories(response: AssetMatrixCategoriesPaginationResponse) {
        
        this._assetMatrixCategories = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllAssetMatrixCategories(AssetMatrixCategories: AssetMatrixCategories[]) {
       
        this._assetMatrixCategories = AssetMatrixCategories;
        this.loaded = true;
        
    }

    @action
    updateAssetMatrixCategories(type: AssetMatrixCategories) {
        // const types: BusinessApplications[] = this._businessApplications.slice();
        // const index: number = types.findIndex(e => e.id == type.id);
        // if (index != -1) {
        //     types[index] = type;
        //     this._businessApplications = types;
        // }
        this.AssetMatrixCategoriesDetails=type
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
    get allItems(): AssetMatrixCategories[] {
        return this._assetMatrixCategories.slice();
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

export const AssetMatrixCategoriesMasterStore = new Store();