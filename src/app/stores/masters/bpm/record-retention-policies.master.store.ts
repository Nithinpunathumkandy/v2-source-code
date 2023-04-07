import { observable, action, computed } from "mobx-angular";
import { RecordRetentionPolicies, RecordRetentionPoliciesPaginationResponse } from "src/app/core/models/masters/bpm/record-retention-policies";

class Store {
    @observable
    private _recordRetentionPolicies: RecordRetentionPolicies[] = [];

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
    orderItem: string = 'record_retention_policies.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setRecordRetentionPolicies(response: RecordRetentionPoliciesPaginationResponse) {

        this._recordRetentionPolicies = response.data;
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
    updateRecordRetentionPolicies(type: RecordRetentionPolicies) {
        const types: RecordRetentionPolicies[] = this._recordRetentionPolicies.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._recordRetentionPolicies = types;
        }
    }

    @computed
    get RecordRetentionPolicies(): RecordRetentionPolicies[] {
        return this._recordRetentionPolicies.slice();
    }


    @action
    getRecordRetentionPoliciesById(id: number): RecordRetentionPolicies {
        return this._recordRetentionPolicies.slice().find(e => e.id == id);
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

export const RecordRetentionPoliciesMasterStore = new Store();