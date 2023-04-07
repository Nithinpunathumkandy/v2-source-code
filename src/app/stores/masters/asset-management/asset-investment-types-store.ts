import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { AssetInvestmentTypes, AssetInvestmentTypesPaginationResponse } from "src/app/core/models/masters/asset-management/asset-investment-types";

class Store {
    @observable
    private _assetInvestmentTypes: AssetInvestmentTypes[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'asset_investment_type_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setAssetInvestmentTypes(response: AssetInvestmentTypesPaginationResponse) {
        
        this._assetInvestmentTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllAssetInvestmentTypes(AssetInvestmentTypes: AssetInvestmentTypes[]) {
       
        this._assetInvestmentTypes = AssetInvestmentTypes;
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
    get allItems(): AssetInvestmentTypes[] {
        return this._assetInvestmentTypes.slice();
    }

}

export const AssetInvestmentTypesMasterStore = new Store();