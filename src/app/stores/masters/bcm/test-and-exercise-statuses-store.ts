

import { observable, action, computed } from "mobx-angular";
import { TestAndExerciseStatuses, TestAndExerciseStatusesPaginationResponse } from "src/app/core/models/masters/bcm/test-and-exercise-statuses";


class Store {
    @observable
    private _testAndExerciseStatuses: TestAndExerciseStatuses[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'test_and_exercise_status_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setTestAndExerciseStatuses(response: TestAndExerciseStatusesPaginationResponse) {        
        this._testAndExerciseStatuses = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllTestAndExerciseStatuses(testAndExerciseStatuses: TestAndExerciseStatuses[]) {
        this._testAndExerciseStatuses = testAndExerciseStatuses;
        this.loaded = true;
    }

    @action
    setCurrentPage(currentPage: number) {
        this.currentPage = currentPage;
    }

    @action
    setOrderBy(orderBy: 'asc' | 'desc') {
        this.orderBy = orderBy;
    }

    @computed
    get allItems(): TestAndExerciseStatuses[] {
        return this._testAndExerciseStatuses.slice();
    }

}

export const TestAndExerciseStatusesMasterStore = new Store();