import { observable, action, computed } from "mobx-angular";
import { Deliverable , DeliverablePaginationResponse } from "src/app/core/models/event-monitoring/events/event-deliverable";


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
    individualTaskDeliverable: DeliverablePaginationResponse;

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
    setIndividualDeliverable(taskDeliverable: any) {

        this.individualTaskDeliverable = taskDeliverable.data ;
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
    setReplies(response: DeliverablePaginationResponse) {

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

    @computed
    get individualDeliverableId() {
        return this.individualTaskDeliverable;
    }

    // @action
    // // deleteTaskDeliverableById(id: number) {

    // //     const index = this._selectedTaskDeliverableAll.findIndex(e => e.id === id);
    // //     return this._selectedTaskDeliverableAll.splice(index, 1);

    // // }

    @computed
    get selectedAllItems(): Deliverable[] {
        return this._selectedTaskDeliverableAll.slice();
    }

    @action
    addSelecteIssueDeliverable(issues) {
        this._selectedTaskDeliverableAll = issues;
    }

    @action
    updateDeliverable(type: Deliverable) {
        const types: Deliverable[] = this._taskDeliverable.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._taskDeliverable = types;
        }
    }

}

export const DeliverableMasterStore = new Store();