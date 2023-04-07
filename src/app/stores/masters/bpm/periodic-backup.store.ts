import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { PeriodicBackup, PeriodicBackupPaginationResponse } from "src/app/core/models/masters/bpm/periodic-backup";

class Store {
    @observable
    private _PeriodicBackup: PeriodicBackup[] = [];

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
    orderItem: string = 'periodic_backups.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    PeriodicBackupDetails: any;

    searchText: string;

    @action
    setPeriodicBackup(response: PeriodicBackupPaginationResponse) {

        this._PeriodicBackup = response.data;
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
    updatePeriodicBackup(type: PeriodicBackup) {
        // const Location: PeriodicBackup[] = this._PeriodicBackup.slice();
        // const index: number = Location.findIndex(e => e.id == type.id);
        // if (index != -1) {
        //     Location[index] = type;
        //     this._PeriodicBackup = Location;
        // }
        this.PeriodicBackupDetails=type
    }

    @computed
    get PeriodicBackup(): PeriodicBackup[] {

        return this._PeriodicBackup.slice();
    }
    @computed
    get allItems(): PeriodicBackup[] {

        return this._PeriodicBackup.slice();
    }

    @action
    getPeriodicBackupById(id: number): PeriodicBackup {
        return this._PeriodicBackup.slice().find(e => e.id == id);
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

export const PeriodicBackupMasterStore = new Store();