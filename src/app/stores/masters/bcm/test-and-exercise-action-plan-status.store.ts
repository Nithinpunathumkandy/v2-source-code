import { observable,action, computed } from "mobx-angular";
import { TestAndExerciseActionPlanStatus, TestAndExerciseActionPlanStatusPaginationResponse } from "src/app/core/models/masters/bcm/test-and-exercise-action-plan-status";

class Store{

    @observable
    private _testAndExerciseActionPlanStatus: TestAndExerciseActionPlanStatus[] = [];

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
    orderItem: string = 'test-and-exercise-action-plan-statuses.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;


    @action
    setTestAndExerciseActionPlanStatus(response: TestAndExerciseActionPlanStatusPaginationResponse) {

        this._testAndExerciseActionPlanStatus = response.data;
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

    // @action
    // updateTestAndExerciseCommunications(type: TestAndExerciseCommunications) {
    //     const types: TestAndExerciseCommunications[] = this._testAndExerciseCommunications.slice();
    //     const index: number = types.findIndex(e => e.id == type.id);
    //     if (index != -1) {
    //         types[index] = type;
    //         this._testAndExerciseCommunications = types;
    //     }
    // }

    @computed
    get allItems(): TestAndExerciseActionPlanStatus[] {
        return this._testAndExerciseActionPlanStatus.slice();
    }

    @action
    getTestAndExerciseActionPlanStatusById(id: number): TestAndExerciseActionPlanStatus {
        return this._testAndExerciseActionPlanStatus.slice().find(e => e.id == id);
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
export const TestAndExerciseActionPlanStatusMasterStore = new Store();