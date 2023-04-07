import { observable, action, computed } from "mobx-angular";
import { TestAndExerciseCommunications, TestAndExerciseCommunicationsPaginationResponse } from "src/app/core/models/masters/bcm/test-and-exercise-communications";

class Store {
    @observable
    private _testAndExerciseCommunications: TestAndExerciseCommunications[] = [];

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
    orderItem: string = 'test_and_exercise_plan_communications.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setTestAndExerciseCommunications(response: TestAndExerciseCommunicationsPaginationResponse) {

        this._testAndExerciseCommunications = response.data;
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
    updateTestAndExerciseCommunications(type: TestAndExerciseCommunications) {
        const types: TestAndExerciseCommunications[] = this._testAndExerciseCommunications.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._testAndExerciseCommunications = types;
        }
    }

    @computed
    get allItems(): TestAndExerciseCommunications[] {
        return this._testAndExerciseCommunications.slice();
    }

    @action
    getTestAndExerciseCommunicationsById(id: number): TestAndExerciseCommunications {
        return this._testAndExerciseCommunications.slice().find(e => e.id == id);
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

export const TestAndExerciseCommunicationsMasterStore = new Store();