import { observable, action, computed } from "mobx-angular";
import { History,HistoryResponse } from "src/app/core/models/kpi-management/improvement-plans/improvement-plans-history";
class Store{

    @observable
    private _history: History[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = 15;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    orderItem: string = '';

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @action
    setHistory(response: HistoryResponse) {
        this._history = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    
    @computed
    get history(): History[] {
        return this._history.slice();
    }

    @action
    unSetHistory() {
        this.loaded = false;
        this.from = null;
        this.totalItems = null;
        this.currentPage = null;
        this._history = [];
        this.itemsPerPage = null;
    }
}
export const ImprovementPlansHistoryStore = new Store();