import { observable, action, computed } from "mobx-angular";
import { Deliverable, DeliverablePaginationResponse } from 'src/app/core/models/project-management/project-details/project-deliverable/project-deliverable';

class Store {

    @observable
    private _taskDeliverable: Deliverable[] = [];

    @observable
    _selectedTaskDeliverableAll: Deliverable[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    individualTaskDeliverable: Deliverable;

    @observable
    lastInsertedId: number = null;

    @observable
    individualLoaded: boolean = false;

    @observable
    orderItem: string = 'deliverables';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    from: number = null;

    searchText: string;

    @action
    setCurrentPage(currentPage: number) {
        this.currentPage = currentPage;
    }

    @action
    setIndividualDeliverable(taskDeliverable: Deliverable) {

        this.individualTaskDeliverable = taskDeliverable;
        this.individualLoaded = true;

    }

    @computed
    get allItems(): Deliverable[] {
        return this._taskDeliverable.slice();
    }

    @action
    setDeliverable(response: DeliverablePaginationResponse) {

        this._taskDeliverable = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setLastInsertedId(id: number) {
        this.lastInsertedId = id;
    }

    get individualDeliverableId() {
        return this.individualTaskDeliverable;
    }

    @action
    deleteTaskDeliverableById(id: number) {

        const index = this._selectedTaskDeliverableAll.findIndex(e => e.id === id);
        return this._selectedTaskDeliverableAll.splice(index, 1);

    }

    @computed
    get selectedAllItems(): Deliverable[] {
        return this._selectedTaskDeliverableAll.slice();
    }

    @action
    addSelecteIssueDeliverable(issues) {
        this._selectedTaskDeliverableAll = issues;
    }

}

export const DeliverableMasterStore = new Store();