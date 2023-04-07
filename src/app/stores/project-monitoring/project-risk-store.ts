import { observable, action, computed } from "mobx-angular";
import { RiskPaginationResponse, Risks } from "src/app/core/models/project-monitoring/project-risk";

class Store {
    @observable
    private _risk: Risks[] = [];

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
    orderItem: string = 'project_monitor_risks.id';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setRisk(response: RiskPaginationResponse) {

        this._risk = response.data;
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
    updateRisk(type: Risks) {
        const types: Risks[] = this._risk.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._risk = types;
        }
    }

    @computed
    get Risk(): Risks[] {

        return this._risk.slice();
    }
    @computed
    get allItems(): Risks[] {

        return this._risk.slice();
    }

    @action
    getRiskById(id: number): Risks {
        return this._risk.slice().find(e => e.id == id);
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

export const RiskStore = new Store();