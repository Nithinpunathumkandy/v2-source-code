import { observable, action, computed } from "mobx-angular";
import { IndividualProjectTasks, ProjectTasks, ProjectTasksPaginationResponse } from "src/app/core/models/project-management/project-details/project-tasks/project-tasks";


class Store {
    @observable
    private projectTasks: ProjectTasks[] = [];

    @observable
    private _individualProjectTasks: IndividualProjectTasks;

    @observable  
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'project_tasks_title.created_at';

    @observable
    individualLoaded: boolean = false;


    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;

    @observable
    preview_url: string;

    @observable
    searchText: string;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setProjectTasks(response: ProjectTasksPaginationResponse) {
        this.projectTasks = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }


    @action
    setIndividualProjectTasks(indivitual: IndividualProjectTasks) {       
    this._individualProjectTasks = indivitual;
    this.individualLoaded = true;
    
    }

    @computed
    get allItems(): ProjectTasks[] {
        return this.projectTasks.slice();
    }

    @computed
    get indivitualProjectTasks(){
        return this._individualProjectTasks
    }

    @action
    unsetIndivitualProjectTasks() {       
        this._individualProjectTasks = null;
        this.individualLoaded = false;   
    }
  
}


export const ProjectTasksStore = new Store();

