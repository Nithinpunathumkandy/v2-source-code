import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { IssueCategory,IssueCategoryPaginationResponse } from 'src/app/core/models/masters/organization/issue-category';

class Store {
    @observable
    private _issueCategories: IssueCategory[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    orderItem: string = 'issue_categories.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;

    searchText: string;

    @action
    setIssueCategories(response: IssueCategoryPaginationResponse) {
        
        this._issueCategories = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setAllIssueCategories(category: IssueCategory[]) {
       
        this._issueCategories = category;
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
    updateIssueCategory(category: IssueCategory) {
        const categories: IssueCategory[] = this._issueCategories.slice();
        const index: number = categories.findIndex(e => e.id == category.id);
        if (index != -1) {
            categories[index] = category;
            this._issueCategories=categories;
        }
    }

    @computed
    get issueCategories(): IssueCategory[] {
        
        return this._issueCategories.slice();
    }

    @action
    getIssueById(id: number): IssueCategory {
        return this._issueCategories.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }
}


export const IssueCategoryMasterStore = new Store();