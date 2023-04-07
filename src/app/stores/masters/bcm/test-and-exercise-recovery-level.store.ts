import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { TestAndExerciseRecoveryLevel, TestAndExerciseRecoveryLevelPaginationResponse } from "src/app/core/models/masters/bcm/test-and-exercise-recovery-level";

class Store {
    @observable
    private _testAndExerciseRecoveryLevel: TestAndExerciseRecoveryLevel[] = [];

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
    orderItem: string = 'test_and_exercise_recovery_levels.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setTestAndExerciseRecoveryLevel(response: TestAndExerciseRecoveryLevelPaginationResponse) {

        this._testAndExerciseRecoveryLevel = response.data;
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
    updateTestAndExerciseRecoveryLevel(type: TestAndExerciseRecoveryLevel) {
        const types: TestAndExerciseRecoveryLevel[] = this._testAndExerciseRecoveryLevel.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._testAndExerciseRecoveryLevel = types;
        }
    }

    @computed
    get TestAndExerciseRecoveryLevel(): TestAndExerciseRecoveryLevel[] {

        return this._testAndExerciseRecoveryLevel.slice();
    }
    @computed
    get allItems(): TestAndExerciseRecoveryLevel[] {

        return this._testAndExerciseRecoveryLevel.slice();
    }

    @action
    getTestAndExerciseRecoveryLevelById(id: number): TestAndExerciseRecoveryLevel {
        return this._testAndExerciseRecoveryLevel.slice().find(e => e.id == id);
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

export const TestAndExerciseRecoveryLevelMasterStore = new Store();