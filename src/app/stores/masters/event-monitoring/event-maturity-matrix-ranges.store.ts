import { observable, action, computed } from "mobx-angular";
import { MaturityMatrixRanges , MaturityMatrixRangesPaginationResponse } from "../../../core/models/masters/event-monitoring/event-maturity-matrix-ranges";

class Store {
    @observable
    private _maturityMatrix: MaturityMatrixRanges[] = [];

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
    orderItem: string = 'event_maturity_matrix_ranges.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    searchText: string;

    @action
    setMaturityMatrixRanges(response: MaturityMatrixRangesPaginationResponse) {
        this._maturityMatrix = response.data;
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

    @computed
    get allItems(): MaturityMatrixRanges[] {
        return this._maturityMatrix.slice();
    }

}

export const EventMaturityMatrixRangesMaster = new Store();