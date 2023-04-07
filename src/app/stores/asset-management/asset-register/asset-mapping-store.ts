import { observable, action, computed } from "mobx-angular";
class Store {
    @observable
    private _assetMappingList;

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    orderItem: string = 'asset-title';

    @observable
    individual_asset_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    assetId: number = null;

    @observable
    selected: number = null;

    @observable
    searchText: string;

    @observable
    projects=[];
    
    @observable
    locations=[];

    @observable
    products=[];

    @observable
    controls=[];

    @observable
    customers=[];

    @observable
    objectives=[];

  
    @action
    setAssetMappingDetails(response) {
        this._assetMappingList = response; 
        this.loaded = true;
        //this.updateUserJob(response.data);
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @computed
    get assetMappingDetails() {

        return this._assetMappingList;
    }
}

export const AssetMappingStore = new Store();