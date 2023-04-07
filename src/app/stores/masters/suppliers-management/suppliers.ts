import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { Suppliers, SuppliersPaginationResponse } from "src/app/core/models/masters/suppliers-management/suppliers";
import { Image } from "src/app/core/models/image.model";

class Store {
    @observable
    private _suppliers: Suppliers[] = [];

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
    orderItem: string = 'suppliers.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    logo_preview_available = false;

    @observable
    private _imageDetails: Image = null;

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
    setSuppliers(response: SuppliersPaginationResponse) {

        this._suppliers = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setAllSuppliers(res:Suppliers[]){
        this._suppliers = res
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
    updateSuppliers(type: Suppliers) {
        const types: Suppliers[] = this._suppliers.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._suppliers = types;
        }
    }

    @computed
    get suppliers(): Suppliers[] {

        return this._suppliers.slice();
    }
    @computed
    get allItems(): Suppliers[] {

        return this._suppliers.slice();
    }

    @action
    getSuppliersById(id: number): Suppliers {
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
    setFileDetails(details: Image, url: string, type: string) {
        if (type == 'logo') {
            this._imageDetails = details;
            // this.preview_url = url;
        }
    }

    @action // Unset File Details
    unsetFileDetails(type: string) {
        if (type == 'logo') {
            if (this._imageDetails.hasOwnProperty('is_new')) {
                this._imageDetails = null;
                // this.preview_url = null;
            }
            else {
                this._imageDetails['is_deleted'] = true;
                // this.preview_url = null;
            }
        }
    }

    // Return File Details By Type
    getFileDetailsByType(type: string): Image {
        if (type == 'logo')
            return this._imageDetails;
    }

    get LastInsertedId(): number {
        if (this.lastInsertedId)
            return this.lastInsertedId;
        else
            return null;
    }

}

export const SuppliersMasterStore = new Store();