import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { IssueDomain,IssueDomainPaginationResponse } from 'src/app/core/models/masters/organization/issue-domain';

class Store {
    @observable
    private _issueDomains: IssueDomain[] = [];

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
    orderItem: string = 'issue_domain.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;

    searchText: string;

    @action
    setIssueDomains(response: IssueDomainPaginationResponse) {
        
        this._issueDomains = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setAllIssueDomains(domains: IssueDomain[]) {
        this.loaded = true;
        this._issueDomains = domains;
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
    updateIssueDomain(domain: IssueDomain) {
        const domains: IssueDomain[] = this._issueDomains.slice();
        const index: number = domains.findIndex(e => e.id == domain.id);
        if (index != -1) {
            domains[index] = domain;
            this._issueDomains=domains;
        }
    }

    @computed
    get issueDomains(): IssueDomain[] {
        
        return this._issueDomains.slice();
    }

    @action
    getIssueById(id: number): IssueDomain {
        return this._issueDomains.slice().find(e => e.id == id);
    }

    @action
    setlastInsertedId(id: number){
        this.lastInsertedId = id;
    }
}

export const IssueDomainMasterStore = new Store();