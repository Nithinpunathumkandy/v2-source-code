import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { ComplianceCategory, ComplianceCategoryPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/compliance-category';

class Store {
    @observable
    private _complianceCategories: ComplianceCategory[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'complaince_categories_created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setComplianceCategories(response: ComplianceCategoryPaginationResponse) {
        
        this._complianceCategories = response.data;
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
    updateComplianceCategory(category: ComplianceCategory) {
        const categories: ComplianceCategory[] = this._complianceCategories.slice();
        const index: number = categories.findIndex(e => e.id == category.id);
        if (index != -1) {
            categories[index] = category;
            this._complianceCategories = categories;
        }
    }

    @computed
    get complianceCategories(): ComplianceCategory[] {
        
        return this._complianceCategories.slice();
    }

    @action
    getComplianceById(id: number): ComplianceCategory {
        return this._complianceCategories.slice().find(e => e.id == id);
    }

}

export const ComplianceCategoryMasterStore = new Store();