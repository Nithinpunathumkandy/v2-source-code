import { observable, action, computed } from "mobx-angular";
import {AssetTypes,AssetTypesPaginationResponse} from '../../../core/models/masters/asset-management/asset-types'

class Store{
    @observable 
    private _assetTypes:AssetTypes[]=[];

    @observable 
    loaded:boolean=false;
   
    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    orderItem: string = 'asset_types.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedAssetTypes: number = null;

    searchText: string;


    @observable
    add_conrol_type_modal: boolean = false

    @action
    setAssetTypes(response:AssetTypesPaginationResponse){
        this._assetTypes=response.data;
        this.currentPage=response.current_page;
        this.itemsPerPage=response.per_page;
        this.totalItems=response.total;
        this.from = response.from;
        this.loaded=true;
    }

    @action
    setCurrentPage(current_page:number){
        this.currentPage=current_page;
    }

   
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    updateAssetTypes(AssetTypes: AssetTypes) {
        const assetTypes: AssetTypes[] = this._assetTypes.slice();
        const index: number = assetTypes.findIndex(e => e.id == AssetTypes.id);
        if (index != -1) {
            AssetTypes[index] = AssetTypes;
            this._assetTypes = assetTypes;
        }
    }

    @computed
    get assetTypes(): AssetTypes[] {
        
        return this._assetTypes.slice();
    }

    @action
    getAssetTypesById(id: number): AssetTypes {
        return this._assetTypes.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedassetTypes(assetTypesId: number){
        this.lastInsertedAssetTypes = assetTypesId;
    }

    get lastInsertedassetTypes():number{
        if(this.lastInsertedAssetTypes) 
            return this.lastInsertedAssetTypes;
        else 
            return null;
    }

}

export const AssetTypesMasterStore = new Store();