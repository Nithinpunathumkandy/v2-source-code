import { observable, action, computed } from "mobx-angular";
import { TaskPriorities, TaskPrioritiesPaginationResponse } from "src/app/core/models/masters/project-management/task-priorities";

class Store{

    @observable
    private _taskPriorities:TaskPriorities[] = [];

    @observable
    _selectedTaskPriorities: TaskPriorities[] = [];

    @observable
    loaded:boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    individualTaskPriorities: TaskPriorities;

    @observable
    lastInsertedId: number = null;

    @observable
    individualLoaded: boolean = false;

    @observable
    orderItem: string = 'task_priorities.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    from: number = null;

    searchText: string;

    @action
    setCurrentPage(currentPage: number) {
        this.currentPage = currentPage;
    }

    @action
    setindividualTaskPriorities(taskPriorities: TaskPriorities) {
       
        this.individualTaskPriorities = taskPriorities;
        this.individualLoaded = true;
        
    }

    @computed
    get allItems(): TaskPriorities[]{
        return this._taskPriorities.slice();
    }

    @action
    setTaskPriorities(response:TaskPrioritiesPaginationResponse){
        
        this._taskPriorities = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    get individualTaskPrioritiesId(){
        return this.individualTaskPriorities;
    } 

    @action
    getTaskPrioritiesById(id: number): TaskPriorities {
        return this._taskPriorities.slice().find(e => e.id == id);
    }

    @action
    deleteTaskPrioritiesById(id: number) {
        
        const index = this._selectedTaskPriorities.findIndex(e => e.id === id); 
        return this._selectedTaskPriorities.splice(index, 1); 
        
    }

    @computed
    get selectedAllItems(): TaskPriorities[] {
        return this._selectedTaskPriorities.slice();
    }

    @action
    addSelecteIssueCategory(issues){
        this._selectedTaskPriorities = issues;
    }

}

export const TaskPrioritiesMasterStore = new Store();