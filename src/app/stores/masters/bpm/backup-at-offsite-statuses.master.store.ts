import { observable, action, computed } from "mobx-angular";
import { BackupAtOffsiteStatuses, BackupAtOffsiteStatusesPaginationResponse } from "src/app/core/models/masters/bpm/backup-at-offsite-statuses";

class Store {
    @observable
    private _backupAtOffsiteStatuses: BackupAtOffsiteStatuses[] = [];

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
    orderItem: string = 'backup_at_offsite_status_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setBackupAtOffsiteStatuses(response: BackupAtOffsiteStatusesPaginationResponse) {

        this._backupAtOffsiteStatuses = response.data;
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
    updateBackupAtOffsiteStatuses(type: BackupAtOffsiteStatuses) {
        const types: BackupAtOffsiteStatuses[] = this._backupAtOffsiteStatuses.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._backupAtOffsiteStatuses = types;
        }
    }

    @computed
    get backupAtOffsiteStatuses(): BackupAtOffsiteStatuses[] {
        return this._backupAtOffsiteStatuses.slice();
    }


    @action
    getBackupAtOffsiteStatusesById(id: number): BackupAtOffsiteStatuses {
        return this._backupAtOffsiteStatuses.slice().find(e => e.id == id);
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

export const BackupAtOffsiteStatusesMasterStore = new Store();