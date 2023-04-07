import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { KpiCategory, KpiCategoryPaginationResponse } from 'src/app/core/models/masters/human-capital/kpi-category';

class Store {
    @observable
    private _kpiCategories: KpiCategory[] = [];

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    loaded: boolean = false;

    @observable
    from: number = null;

    @observable
    lastInsertedId: number = null;

    @observable
    orderItem:string = 'kpi_categories.created_at';

    searchText: string;


    @action
    setKpiCategories(response: KpiCategoryPaginationResponse) {
        this._kpiCategories = response.data;
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
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    updateKpiCategory(kpiCategory: KpiCategory) {
        const kpiCategories: KpiCategory[] = this._kpiCategories.slice();
        const index: number = kpiCategories.findIndex(e => e.id == kpiCategory.id);
        if (index != -1) {
            kpiCategories[index] = kpiCategory;
            this._kpiCategories = kpiCategories;
        }
    }

    @computed
    get kpiCategories(): KpiCategory[] {

        return this._kpiCategories.slice();
    }

    @action
    getKpiCategoryById(id: number): KpiCategory {
        return this._kpiCategories.slice().find(e => e.id == id);
    }
}

export const KpiCategoryMasterStore = new Store();