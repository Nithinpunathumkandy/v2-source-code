import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { TestAndExerciseChecklist, TestAndExerciseChecklistPaginationResponse } from "src/app/core/models/masters/bcm/test-and-exercise-checklist";

class Store {
    @observable
    private _testAndExerciseChecklist: TestAndExerciseChecklist[] = [];

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
    orderItem: string = 'test_and_exercise_checklists.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setTestAndExerciseChecklist(response: TestAndExerciseChecklistPaginationResponse) {

        this._testAndExerciseChecklist = response.data;
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
    updateTestAndExerciseChecklist(type: TestAndExerciseChecklist) {
        const types: TestAndExerciseChecklist[] = this._testAndExerciseChecklist.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._testAndExerciseChecklist = types;
        }
    }

    @computed
    get TestAndExerciseChecklist(): TestAndExerciseChecklist[] {

        return this._testAndExerciseChecklist.slice();
    }
    @computed
    get allItems(): TestAndExerciseChecklist[] {

        return this._testAndExerciseChecklist.slice();
    }

    @action
    getTestAndExerciseChecklistById(id: number): TestAndExerciseChecklist {
        return this._testAndExerciseChecklist.slice().find(e => e.id == id);
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

export const TestAndExerciseChecklistMasterStore = new Store();