import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { SlaCategory, SlaCategoryPaginationResponse } from 'src/app/core/models/masters/compliance-management/sla-category';

class Store {
    @observable
    private _slaCategory: SlaCategory[] = [];

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
    orderItem: string = 'sla_category.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setSlaCategory(response: SlaCategoryPaginationResponse) {

        this._slaCategory = response.data;
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
    updateSlaCategory(type: SlaCategory) {
        const types: SlaCategory[] = this._slaCategory.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._slaCategory = types;
        }
    }

    @computed
    get slaCategory(): SlaCategory[] {

        return this._slaCategory.slice();
    }
    @computed
    get allItems(): SlaCategory[] {

        return this._slaCategory.slice();
    }

    @action
    getSlaCategoryById(id: number): SlaCategory {
        return this._slaCategory.slice().find(e => e.id == id);
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

export const SlaCategoryMasterStore = new Store();