import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { StorageTypes, StorageTypesPaginationResponse } from "src/app/core/models/masters/bpm/storage-types";

class Store {
    @observable
    private _storageTypes: StorageTypes[] = [];

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
    orderItem: string = 'storage_types.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    storageTypesDetails: any;

    searchText: string;

    @action
    setStorageTypes(response: StorageTypesPaginationResponse) {

        this._storageTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
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
    updateStorageTypes(type: StorageTypes) {
        // const types: StorageTypes[] = this._storageTypes.slice();
        // const index: number = types.findIndex(e => e.id == type.id);
        // if (index != -1) {
        //     types[index] = type;
        //     this._storageTypes = types;
        // }
        this.storageTypesDetails=type
    }

    @computed
    get StorageTypes(): StorageTypes[] {

        return this._storageTypes.slice();
    }
    @computed
    get allItems(): StorageTypes[] {

        return this._storageTypes.slice();
    }

    @action
    getStorageTypesById(id: number): StorageTypes {
        return this._storageTypes.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedId(id: number) {
        this.lastInsertedId = id;
    }

    get LastInsertedId(): number {
        if (this.lastInsertedId)
            return this.lastInsertedId;
        else
            return null;
    }

}

export const StorageTypesMasterStore = new Store();