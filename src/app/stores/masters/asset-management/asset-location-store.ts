
import { observable, action, computed } from "mobx-angular";
import { AssetLocation, AssetLocationPaginationResponse, IndividualAssetLocation } from "src/app/core/models/masters/asset-management/asset-location";



class Store {
    @observable
    private _assetLocation: AssetLocation[] = [];

    @observable
    private _assetLocationDetails:IndividualAssetLocation;

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;z

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'asset_locations.created_at';

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
    setAssetLocation(response: AssetLocationPaginationResponse) {
        

        this._assetLocation = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllAssetLocation(assetLocation: AssetLocation[]) {
       
        this._assetLocation = assetLocation;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): AssetLocation[] {
        
        return this._assetLocation.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getAssetLocationById(id: number): AssetLocation {
        return this._assetLocation.slice().find(e => e.id == id);
    }

    @action
    setIndividualAssetLocation(details:IndividualAssetLocation) {
     
        this._assetLocationDetails=details;
    }
    unsetIndividualBiaCategory(){
  
        this._assetLocationDetails = null;
    }

    @computed
    get assetLocationDetails(): IndividualAssetLocation {
    return this._assetLocationDetails;
    }
}

export const AssetLocationStore = new Store();

