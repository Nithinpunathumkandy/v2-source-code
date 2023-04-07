
import { observable, action, computed } from "mobx-angular";

import { ProductCategory,ProductCategoryPaginationResponse } from 'src/app/core/models/masters/organization/product-category';


class Store {
    @observable
    private _productCategories: ProductCategory[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'product_categories.created_at';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

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
    setProductCategory(response: ProductCategoryPaginationResponse) {
        

        this._productCategories = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllProductCategory(ProductCategory: ProductCategory[]) {
       
        this._productCategories = ProductCategory;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): ProductCategory[] {
        
        if(this._productCategories.length > 0) return this._productCategories.slice();
        else return [];
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getProductCategoryById(id: number): ProductCategory {
        return this._productCategories.slice().find(e => e.id == id);
    }
  
}

export const ProductCategoryMasterStore = new Store();

