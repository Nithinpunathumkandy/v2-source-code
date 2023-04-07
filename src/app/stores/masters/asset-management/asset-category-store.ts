
import { observable, action, computed } from "mobx-angular";
import { AssetCategory, AssetCategoryPaginationResponse } from "src/app/core/models/masters/asset-management/asset-category";


class Store {
    @observable
    private _assetCategory: AssetCategory[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;z

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'asset_categories.created_at';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;

    searchText: string;
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setAssetCategory(response: AssetCategoryPaginationResponse) {
        

        this._assetCategory = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllAssetCategory(assetCategory: AssetCategory[]) {
       
        this._assetCategory = assetCategory;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): AssetCategory[] {
        
        return this._assetCategory.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @computed
    get LastInsertedId(): number {
        if (this.lastInsertedId)
            return this.lastInsertedId;
        else
            return null;
    }

    @action
    getAssetCategoryById(id: number): AssetCategory {
        return this._assetCategory.slice().find(e => e.id == id);
    }
  
}

export const AssetCategoryStore = new Store();

