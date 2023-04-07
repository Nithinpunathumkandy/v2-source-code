import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { ProcessOperationModes, ProcessOperationModesPaginationResponse } from "src/app/core/models/masters/bpm/process-operation-modes";

class Store {
    @observable
    private _ProcessOperationModes: ProcessOperationModes[] = [];

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
    orderItem: string = 'process_operation_modes.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setProcessOperationModes(response: ProcessOperationModesPaginationResponse) {

        this._ProcessOperationModes = response.data;
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
    updateProcessOperationModes(type: ProcessOperationModes) {
        const types: ProcessOperationModes[] = this._ProcessOperationModes.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._ProcessOperationModes = types;
        }
    }

    @computed
    get ProcessOperationModes(): ProcessOperationModes[] {

        return this._ProcessOperationModes.slice();
    }
    @computed
    get allItems(): ProcessOperationModes[] {

        return this._ProcessOperationModes.slice();
    }

    @action
    getProcessOperationModesById(id: number): ProcessOperationModes {
        return this._ProcessOperationModes.slice().find(e => e.id == id);
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

export const OperationModesMasterStore = new Store();