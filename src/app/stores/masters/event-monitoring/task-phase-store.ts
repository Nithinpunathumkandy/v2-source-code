import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { TaskPhase, TaskPhasePaginationResponse } from "src/app/core/models/masters/event-monitoring/task-phase";

class Store {
    @observable
    private _taskPhase: TaskPhase[] = [];

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
    orderItem: string = 'task_phases.id';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    searchText: string;

    @action
    setTaskPhase(response: TaskPhasePaginationResponse) {

        this._taskPhase = response.data;
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
    updateTaskPhase(type: TaskPhase) {
        const types: TaskPhase[] = this._taskPhase.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._taskPhase = types;
        }
    }

    @computed
    get TaskPhase(): TaskPhase[] {

        return this._taskPhase.slice();
    }
    @computed
    get allItems(): TaskPhase[] {

        return this._taskPhase.slice();
    }

    @action
    getTaskPhaseById(id: number): TaskPhase {
        return this._taskPhase.slice().find(e => e.id == id);
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

export const TaskPhaseMasterStore = new Store();