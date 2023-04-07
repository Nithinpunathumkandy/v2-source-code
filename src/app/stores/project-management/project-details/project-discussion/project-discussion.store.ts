import { observable, action, computed } from "mobx-angular";
import { Discussion, DiscussionPaginationResponse } from 'src/app/core/models/project-management/project-details/project-discussion/project-discussion';

class Store {

    @observable
    private _taskDiscussion: Discussion[] = [];

    @observable
    _selectedTaskDiscussionAll: Discussion[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    individualTaskDiscussion: Discussion;

    @observable
    lastInsertedId: number = null;

    @observable
    individualLoaded: boolean = false;

    @observable
    orderItem: string = 'discussions';

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
    setIndividualDiscussion(taskDiscussion: Discussion) {

        this.individualTaskDiscussion = taskDiscussion;
        this.individualLoaded = true;

    }

    @computed
    get allItems(): Discussion[] {
        return this._taskDiscussion.slice();
    }

    @action
    setDiscussion(response: DiscussionPaginationResponse) {

        this._taskDiscussion = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setReplies(response: DiscussionPaginationResponse) {

        this._taskDiscussion = response.data;
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

    get individualDiscussionId() {
        return this.individualTaskDiscussion;
    }

    // @action
    // // deleteTaskDiscussionById(id: number) {

    // //     const index = this._selectedTaskDiscussionAll.findIndex(e => e.id === id);
    // //     return this._selectedTaskDiscussionAll.splice(index, 1);

    // // }

    @computed
    get selectedAllItems(): Discussion[] {
        return this._selectedTaskDiscussionAll.slice();
    }

    @action
    addSelecteIssueDiscussion(issues) {
        this._selectedTaskDiscussionAll = issues;
    }

}

export const DiscussionMasterStore = new Store();