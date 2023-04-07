
import { observable, action, computed } from "mobx-angular";

import { AssetRatings,AssetRatingsPaginationResponse } from 'src/app/core/models/masters/asset-management/asset-ratings';


class Store {
    @observable
    private _assetRatings: AssetRatings[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'asset_ratings.id';

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
    setAssetRatings(response: AssetRatingsPaginationResponse) {
        this._assetRatings = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true; 
    }

    @action
    setAllAssetRatings(document: AssetRatings[]) {
        this._assetRatings = document;
        this.loaded = true;
    }

    @computed
    get allItems(): AssetRatings[] {        
        return this._assetRatings.reverse();
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getAssetRatingsById(id: number): AssetRatings {
        return this._assetRatings.slice().find(e => e.id == id);
    }
  
}

export const AssetRatingsMasterStore = new Store();

