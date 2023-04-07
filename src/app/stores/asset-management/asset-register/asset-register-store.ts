
import { observable, action, computed } from "mobx-angular";

import { AssetRegister, AssetRegisterPaginationResponse, IndividualAsset } from 'src/app/core/models/asset-management/asset-register/asset-register';
import { Image } from "src/app/core/models/image.model";


class Store {
    @observable
    private _assetRegister: AssetRegister[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'assets.created_at';

    @observable
    currentAssetPage = null;

    @observable
    private _individualAssetDetails: IndividualAsset;

    @observable
    addCorporate: boolean = false;

    @observable
    msTypes = [];

    @observable
    assetLocation = [];

    @observable
    custodian = [];

    @observable
    assetId: number = null;

    @observable
    specification: any;

    @observable
    editFlag: boolean = false;

    @observable
    editspecificationFlag: boolean = false;

    @observable
    individual_asset_loaded: boolean = false;

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

    @observable
    private _documentDetails: Image[] = [];

    @observable
    selectedAssets:AssetRegister[]=[]

    @observable
    saveSelected: boolean = false;

    @observable
    assets_select_form_modal:boolean=false;

    @observable
    preview_url: string;

    addSelectedAssests(issues){
        this.selectedAssets = issues;
    }

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

        this.assetId = id;
    }

    @computed
    get docDetails(): Image[] {
        return this._documentDetails.slice();
    }

    @action
    setDocumentDetails(details: Image, url: string) {

        this._documentDetails.push(details);
        this.preview_url = url;

    }

    @action
    unsetDocumentDetails(token?: string) {

        var b_pos = this._documentDetails.findIndex(e => e.token == token)
        if (b_pos != -1) {
            if (this._documentDetails[b_pos].hasOwnProperty('is_new')) {
                this._documentDetails.splice(b_pos, 1);
            }
            else {
                this._documentDetails[b_pos]['is_deleted'] = true;
            }
        }
    }

    @action
    clearDocumentDetails() {
        this._documentDetails = [];
        this.preview_url = null;
    }

    @action
    setAssetRegister(response: AssetRegisterPaginationResponse) {


        this._assetRegister = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;

    }

    @action
    setAllAssetRegister(assetRegister: AssetRegister[]) {

        this._assetRegister = assetRegister;
        this.loaded = true;

    }

    @action
    setEditFlag() {
        this.editFlag = true;
    }

    @action
    setEditspecificationFlag() {
        this.editspecificationFlag = true;
    }

    @action
    unsetEditspecificationFlag() {
        this.editspecificationFlag = false;
    }

    @action
    unsetEditFlag() {
        this.editFlag = false;
    }

    @computed
    get allItems(): AssetRegister[] {

        return this._assetRegister.slice();
    }
    @action
    setLastInsertedId(id: number) {
        this.lastInsertedId = id;
    }

    @action
    getAssetRegisterById(id: number): AssetRegister {
        return this._assetRegister.slice().find(e => e.id == id);
    }

    @action
    setIndividualAssetDetails(details: IndividualAsset) {
        this.individual_asset_loaded = true;
        this._individualAssetDetails = details;
        //this.updateRisk(details);
    }
    @action
    unsetIndiviudalAssetDetails() {
        this._individualAssetDetails = null;
        this.individual_asset_loaded = false;
    }


    @computed
    get individualAssetDetails(): IndividualAsset {
        return this._individualAssetDetails;
    }

}

export const AssetRegisterStore = new Store();

