import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { Module, ModulePaginationResponse } from "src/app/core/models/masters/general/module";

class Store {
    @observable
    private _module: Module[] = [];

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
    orderItem: string = 'module.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setModule(response: ModulePaginationResponse) {

        this._module = response.data;
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
    updateModule(type: Module) {
        const types: Module[] = this._module.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._module = types;
        }
    }

    @computed
    get Module(): Module[] {

        return this._module.slice();
    }
    @computed
    get allItems(): Module[] {

        return this._module.slice();
    }

    @action
    getModuleById(id: number): Module {
        return this._module.slice().find(e => e.id == id);
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

export const ModuleMasterStore = new Store();