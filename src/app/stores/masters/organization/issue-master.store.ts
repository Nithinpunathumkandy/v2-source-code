import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { Issue, IssuePaginationResponse } from 'src/app/core/models/masters/organization/issue';

class Store {
    @observable
    private _issues: Issue[] = [];

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
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'issue.created_at';

    @observable
    lastInsertedId: number = null;

    searchText: string;

    @action
    setIssues(response: IssuePaginationResponse) {
       
        this._issues = response.data;
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
    updateIssue(issue: Issue) {
        const issues: Issue[] = this._issues.slice();
        const index: number = issues.findIndex(e => e.id == issue.id);
        if (index != -1) {
            issues[index] = issue;
           this._issues = issues;
        }
    }
    

    @computed
    get issues(): Issue[] {
        
        return this._issues
    }

    @action
    getIssueById(id: number): Issue {
        return this._issues.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }
}

export const IssueMasterStore = new Store();