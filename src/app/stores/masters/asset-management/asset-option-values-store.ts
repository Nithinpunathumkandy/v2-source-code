
import { observable, action, computed } from "mobx-angular";

import { AssetOptionValues,AssetOptionValuesPaginationResponse } from 'src/app/core/models/masters/asset-management/asset-option-values';


class Store {
    @observable
    private _assetOptionValues: AssetOptionValues[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'asset_option_values.id';

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
    setAssetOptionValues(response: AssetOptionValuesPaginationResponse) {
        this._assetOptionValues = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true; 
    }

    @action
    setAllAssetOptionValues(document: AssetOptionValues[]) {
        this._assetOptionValues = document;
        this.loaded = true;
    }

    @computed
    get allItems(): AssetOptionValues[] {        
        return this._assetOptionValues.reverse();
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getAssetOptionValuesById(id: number): AssetOptionValues {
        return this._assetOptionValues.slice().find(e => e.id == id);
    }
  
}

export const AssetOptionValuesMasterStore = new Store();

