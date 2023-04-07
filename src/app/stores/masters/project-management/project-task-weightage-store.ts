import { observable, action, computed } from "mobx-angular";
import { TaskWeightage,TaskWeightagePaginationResponse} from 'src/app/core/models/masters/project-management/project-task-weightage';

class Store{

    @observable
    private _taskCategory:TaskWeightage[] = [];

    @observable
    _selectedTaskCategoryAll: TaskWeightage[] = [];

    @observable
    loaded:boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    individualTaskCategory: TaskWeightage;

    @observable
    lastInsertedId: number = null;

    @observable
    individualLoaded: boolean = false;

    @observable
    orderItem: string = 'task_weightages.created_at';

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
    setIndividualTaskWeightage(taskCategory: TaskWeightage) {
       
        this.individualTaskCategory = taskCategory;
        this.individualLoaded = true;
        
    }

    @computed
    get allItems(): TaskWeightage[]{
        return this._taskCategory.slice();
    }

    @action
    setTaskWeightage(response:TaskWeightagePaginationResponse){
        
        this._taskCategory = response.data;
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

    get individualTaskWeightageId(){
        return this.individualTaskCategory;
    } 

    @action
    deleteTaskCategoryById(id: number) {
        
        const index = this._selectedTaskCategoryAll.findIndex(e => e.id === id); 
        return this._selectedTaskCategoryAll.splice(index, 1); 
        
    }

    @computed
    get selectedAllItems(): TaskWeightage[] {
        return this._selectedTaskCategoryAll.slice();
    }

    @action
    addSelecteIssueCategory(issues){
        this._selectedTaskCategoryAll = issues;
    }

}

export const TaskWeightageMasterStore = new Store();