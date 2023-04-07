import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { IssueStatus,IssueStatusPaginationResponse } from 'src/app/core/models/masters/organization/issue-status';

class Store {
    @observable
    private _issueStatuses: IssueStatus[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'issue_statuses.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setIssueStatuses(response: IssueStatusPaginationResponse) {
        
        this._issueStatuses = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setAllIssueStatuses(statuses: IssueStatus[]) {
        this.loaded = true;
        this._issueStatuses = statuses;
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
    updateIssueStatus(status: IssueStatus) {
        const statuses: IssueStatus[] = this._issueStatuses.slice();
        const index: number = statuses.findIndex(e => e.id == status.id);
        if (index != -1) {
            statuses[index] = status;
            this._issueStatuses=statuses;
        }
    }

    @computed
    get issueStatuses(): IssueStatus[] {
        
        return this._issueStatuses.slice();
    }

    @action
    getIssueById(id: number): IssueStatus {
        return this._issueStatuses.slice().find(e => e.id == id);
    }
}

export const IssueStatusMasterStore = new Store();