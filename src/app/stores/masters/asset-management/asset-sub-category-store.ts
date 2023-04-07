
import { observable, action, computed } from "mobx-angular";
import { AssetSubCategory, AssetSubCategoryPaginationResponse } from "src/app/core/models/masters/asset-management/asset-sub-category";



class Store {
    @observable
    private _assetSubCategory: AssetSubCategory[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;z

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'asset_sub_categories.created_at';

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
    setAssetSubCategory(response: AssetSubCategoryPaginationResponse) {
        

        this._assetSubCategory = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllAssetSubCategory(assetSubCategory: AssetSubCategory[]) {
       
        this._assetSubCategory = assetSubCategory;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): AssetSubCategory[] {
        
        return this._assetSubCategory.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getAssetSubCategoryById(id: number): AssetSubCategory {
        return this._assetSubCategory.slice().find(e => e.id == id);
    }
    
  
}

export const AssetSubCategoryStore = new Store();

