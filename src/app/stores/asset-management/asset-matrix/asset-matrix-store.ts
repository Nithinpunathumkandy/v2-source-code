
import { observable, action, computed } from "mobx-angular";

import { AssetMatrix,AssetMatrixPaginationResponse, IndividualAssetMatrix } from 'src/app/core/models/asset-management/asset-matrix/asset-matrix';


class Store {
    @observable
    private _assetMatrix: AssetMatrix[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'asset_matrices.created_at';

    @observable
    private _individualAssetMatrixDetails: IndividualAssetMatrix;


    @observable
    assetMatrixId: number = null;

    @observable
    editFlag: boolean = false;

    @observable
    individual_asset_matrix_loaded: boolean = false;

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

    @observable
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
    setAssetId(id: number) {

        this.assetMatrixId = id;
    }

    @action
    setAssetMatrix(response: AssetMatrixPaginationResponse) {
        

        this._assetMatrix = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllAssetMatrix(assetMatrix: AssetMatrix[]) {
       
        this._assetMatrix = assetMatrix;
        this.loaded = true;
        
    }

    @action
    setEditFlag() {
        this.editFlag = true;
    }

    @action
    unsetEditFlag() {
        this.editFlag = false;
    }
    
    @computed
    get allItems(): AssetMatrix[] {
        
        return this._assetMatrix.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getAssetMatrixById(id: number): AssetMatrix {
        return this._assetMatrix.slice().find(e => e.id == id);
    }

    @action
    setIndividualAssetMatrixDetails(details:IndividualAssetMatrix) {
        this.individual_asset_matrix_loaded = true;
        this._individualAssetMatrixDetails = details;
        //this.updateRisk(details);
    }

    unsetIndiviudalAssetMatrixDetails() {
        this._individualAssetMatrixDetails = null;
        this.individual_asset_matrix_loaded = false;
    }

    unsetAssetMatrixDetails() {
        

        this._assetMatrix = [];
      
        this.loaded = false;
       
    }


    @computed
    get individualAssetMatrixDetails(): IndividualAssetMatrix {
        return this._individualAssetMatrixDetails;
    }
  
}

export const AssetMatrixStore = new Store();

