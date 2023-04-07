import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { ProcessAccessibility, ProcessAccessibilityPaginationResponse } from "src/app/core/models/masters/bpm/process-accessibility";

class Store {
    @observable
    private _ProcessAccessibility: ProcessAccessibility[] = [];

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
    orderItem: string = 'process_accessibilities.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setProcessAccessibility(response: ProcessAccessibilityPaginationResponse) {

        this._ProcessAccessibility = response.data;
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
    updateProcessAccessibility(type: ProcessAccessibility) {
        const types: ProcessAccessibility[] = this._ProcessAccessibility.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._ProcessAccessibility = types;
        }
    }

    @computed
    get ProcessAccessibility(): ProcessAccessibility[] {

        return this._ProcessAccessibility.slice();
    }
    @computed
    get allItems(): ProcessAccessibility[] {

        return this._ProcessAccessibility.slice();
    }

    @action
    getProcessAccessibilityById(id: number): ProcessAccessibility {
        return this._ProcessAccessibility.slice().find(e => e.id == id);
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

export const ProcessAccessibilityMasterStore = new Store();