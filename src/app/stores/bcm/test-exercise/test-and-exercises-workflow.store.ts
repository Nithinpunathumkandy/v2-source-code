
import { observable, action, computed } from "mobx-angular";
import { TestAndExercisesWorkflowDetail, TestAndExercisesWorkflowHistory, TestAndExercisesWorkflowHistoryPaginationResponse } from "src/app/core/models/bcm/test-and-exercise/test-and-exercise-workflow";

class Store {
    @observable
    private _testAndExercisesWorkflowList;

    @observable
    loaded: boolean = false;

    @observable
    private _testAndExercisesWorkflowHistory;

    @observable
    historyLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    type: string;

    @observable
    commentForm:boolean=false;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setWorkflowDetails(response: TestAndExercisesWorkflowDetail) {
        this._testAndExercisesWorkflowList = response;
        this.loaded = true;
    }

    
    @computed
    get workflowDetails(): TestAndExercisesWorkflowDetail[] {
        return this._testAndExercisesWorkflowList;
    }


    @action
    setWorkflowHistory(response: TestAndExercisesWorkflowHistoryPaginationResponse) {
        this._testAndExercisesWorkflowHistory = response.data;
         this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        
        this.historyLoaded = true;
    }

    
    @computed
    get workflowHistoryDetails(): TestAndExercisesWorkflowHistory {
        return this._testAndExercisesWorkflowHistory;
    }




}

export const TestAndExercisesWorkflowStore = new Store();