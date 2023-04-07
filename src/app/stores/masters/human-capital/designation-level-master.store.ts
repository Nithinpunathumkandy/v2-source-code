import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { DesignationLevel,DesignationLevelPaginationResponse } from 'src/app/core/models/masters/human-capital/designation-level';

class Store {
    @observable
    private _designationLevels: DesignationLevel[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem:string = 'designation-levels.created_at';

    @observable
    from: number = null;

    searchText: string;



    @action
    setDesignationLevels(response: DesignationLevelPaginationResponse) {
        this.loaded = true;
        this._designationLevels = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.from = response.from;
        this.totalItems = response.total;
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
    updateDesignationLevel(level: DesignationLevel) {
        const levels: DesignationLevel[] = this._designationLevels.slice();
        const index: number = levels.findIndex(e => e.id == level.id);
        if (index != -1) {
            levels[index] = level;
            this._designationLevels = levels;
        }
    }

    @computed
    get designationLevels(): DesignationLevel[] {
        
        return this._designationLevels.slice();
    }

    @action
    getLevelById(id: number): DesignationLevel {
        return this._designationLevels.slice().find(e => e.id == id);
    }
}

export const DesignationLevelMasterStore = new Store();