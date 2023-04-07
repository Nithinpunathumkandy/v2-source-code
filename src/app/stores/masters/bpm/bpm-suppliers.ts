import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { Image } from "src/app/core/models/image.model";
import { BpmSuppliers, BpmSuppliersPaginationResponse, IndividualSuppliers  } from "src/app/core/models/masters/bpm/bpm-suppliers";

class Store {
    @observable
    private _suppliers: BpmSuppliers[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    lastInsertedId: number = null;

    @observable
    selectedSupplierId: number = null

    @observable
    orderItem: string = 'created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'desc' | 'asc' = 'desc';

    @observable
    logo_preview_available = false;

    @observable
    private _imageDetails = null;

    @observable 
    _individualSuppliers = null;

    @observable
    individualLoaded: boolean = false;

    @observable // Boolean flag to decide form opened for add / edit
    addOrEditFlag = false;

    @observable
    add_supplier_modal: boolean = false;

    @observable
    lastInsertedProcessCategory: number = null;

    // @observable // Boolean flag to decide form opened for add / edit
    // addOrEditFlag = false;

    searchText: string;

    @action
    setIndividualSupplier(individual: IndividualSuppliers) {       
    this._individualSuppliers = individual;
    this.individualLoaded = true;
    
    }

    @action
    setSelectedSupplierId(id: number){
        this.selectedSupplierId = id;
    }

    @action
    setSuppliers(response: BpmSuppliersPaginationResponse) {

        this._suppliers = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setAllSuppliers(res:BpmSuppliers[]){
        this._suppliers = res
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'desc' | 'asc') {
        this.orderBy = order_by;
    }


    @action
    updateSuppliers(type: BpmSuppliers) {
        const types: BpmSuppliers[] = this._suppliers.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._suppliers = types;
        }
    }

    @computed
    get individualSuppliers(){
    return this._individualSuppliers
    }

    @computed
    get suppliers(): BpmSuppliers[] {

        return this._suppliers.slice();
    }
    @computed
    get allItems(): BpmSuppliers[] {

        return this._suppliers.slice();
    }

    @action
    getSuppliersById(id: number): BpmSuppliers {
        return this._suppliers.slice().find(e => e.id == id);
    }
    @action
    unsetFile(){
        this._imageDetails=null;
    }

    @action
    setLastInsertedId(id: number) {
        this.lastInsertedId = id;
    }

    @action // Set File Details
    setFileDetails(details: any, url: string) {
            this._imageDetails = details;
    }

    @action // Unset File Details
    unsetFileDetails() {
            if (this._imageDetails.hasOwnProperty('is_new')) {
                this._imageDetails = null;
                // this.preview_url = null;
            }
            else {
                this._imageDetails['is_deleted'] = true;
                // this.preview_url = null;
            }
    }

    // Return File Details By Type
    getFileDetailsByType(){
            return this._imageDetails;
    }

    get LastInsertedId(): number {
        if (this.lastInsertedId)
            return this.lastInsertedId;
        else
            return null;
    }

}

export const BpmSuppliersMasterStore = new Store();