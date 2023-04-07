import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { FrequencyBackup, FrequencyBackupPaginationResponse } from "src/app/core/models/masters/bpm/frequency-backup";

class Store {
    @observable
    private _FrequencyBackup: FrequencyBackup[] = [];

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
    orderItem: string = 'backup_frequencies.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    FrequencyBackupDetails: any;

    searchText: string;

    @action
    setFrequencyBackup(response: FrequencyBackupPaginationResponse) {

        this._FrequencyBackup = response.data;
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
    updateFrequencyBackup(type: FrequencyBackup) {
        // const Location: FrequencyBackup[] = this._FrequencyBackup.slice();
        // const index: number = Location.findIndex(e => e.id == type.id);
        // if (index != -1) {
        //     Location[index] = type;
        //     this._FrequencyBackup = Location;
        // }
        this.FrequencyBackupDetails=type
    }

    @computed
    get FrequencyBackup(): FrequencyBackup[] {

        return this._FrequencyBackup.slice();
    }
    @computed
    get allItems(): FrequencyBackup[] {

        return this._FrequencyBackup.slice();
    }

    @action
    getFrequencyBackupById(id: number): FrequencyBackup {
        return this._FrequencyBackup.slice().find(e => e.id == id);
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

export const FrequencyBackupMasterStore = new Store();