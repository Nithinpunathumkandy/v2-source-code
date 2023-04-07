import { observable, action, computed } from "mobx-angular";
import { BiaScaleCategory, BiaScaleCategoryPaginationResponse } from "src/app/core/models/masters/bcm/bia-scale-category";

class Store {
    @observable
    private _biaScaleCategory: BiaScaleCategory[] = [];

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
    orderItem: string = 'bia_scale_category_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setBiaScaleCategory(response: BiaScaleCategoryPaginationResponse) {

        this._biaScaleCategory = response.data;
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
    updateBiaScaleCategory(type: BiaScaleCategory) {
        const types: BiaScaleCategory[] = this._biaScaleCategory.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._biaScaleCategory = types;
        }
    }

    @computed
    get biaScaleCategory(): BiaScaleCategory[] {
        return this._biaScaleCategory.slice();
    }


    @action
    getBiaScaleCategoryById(id: number): BiaScaleCategory {
        return this._biaScaleCategory.slice().find(e => e.id == id);
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

export const BiaScaleCategoryMasterStore = new Store();