import { observable, action, computed } from "mobx-angular";
import { TestAndExerciseTypes, TestAndExerciseTypesPaginationResponse } from "src/app/core/models/masters/bcm/test-and-exercise-types";

class Store {
    @observable
    private _testAndExerciseTypes: TestAndExerciseTypes[] = [];

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
    orderItem: string = 'test_and_exercise_types.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setTestAndExerciseTypes(response: TestAndExerciseTypesPaginationResponse) {

        this._testAndExerciseTypes = response.data;
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
    updateTestAndExerciseTypes(type: TestAndExerciseTypes) {
        const types: TestAndExerciseTypes[] = this._testAndExerciseTypes.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._testAndExerciseTypes = types;
        }
    }

    @computed
    get allItems(): TestAndExerciseTypes[] {
        return this._testAndExerciseTypes.slice();
    }

    @action
    getTestAndExerciseTypesById(id: number): TestAndExerciseTypes {
        return this._testAndExerciseTypes.slice().find(e => e.id == id);
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

export const TestAndExerciseTypesMasterStore = new Store();