import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { IssueType,IssueTypePaginationResponse } from 'src/app/core/models/masters/organization/issue-type';

class Store {
    @observable
    private _issueTypes: IssueType[] = [];

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
    orderItem: string = 'issue_types.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;

    searchText: string;

    @action
    setIssueTypes(response: IssueTypePaginationResponse) {
        
        this._issueTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setAllIssueTypes(types: IssueType[]) {
        this.loaded = true;
        this._issueTypes = types;
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
    updateIssueType(type: IssueType) {
        const types: IssueType[] = this._issueTypes.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._issueTypes=types;
        }
    }

    @computed
    get issueTypes(): IssueType[] {
        
        return this._issueTypes.slice();
    }

    @action
    getIssueById(id: number): IssueType {
        return this._issueTypes.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    
}

export const IssueTypeMasterStore = new Store();