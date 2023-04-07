import { observable, action, computed } from "mobx-angular";
import { IndividualProjectClosure, ProjectClosure, ProjectClosurePaginationResponse } from "src/app/core/models/project-management/project-details/project-closure/project-closure";


class Store {
    @observable
    private projectClosure: ProjectClosure[] = [];

    @observable
    private _individualProjectClosure: IndividualProjectClosure;

    @observable  
    loaded:boolean=false;

    @observable
    hideSubMenu: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'project_monitor_closures.created_at';

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
    selectedId:number = null;

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
    setProjectClosure(response: ProjectClosurePaginationResponse) {
        this.projectClosure = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }


    @action
    setIndividualProjectClosure(indivitual: IndividualProjectClosure) {       
    this._individualProjectClosure = indivitual;
    this.individualLoaded = true;
    
    }

    @computed
    get allItems(): ProjectClosure[] {
        return this.projectClosure.slice();
    }

    @computed
    get indivitualProjectClosure(){
        return this._individualProjectClosure
    }

    @action
    unsetIndivitualProjectClosure() {       
        this._individualProjectClosure = null;
        this.individualLoaded = false;   
    }
  
}


export const ProjectClosureStore = new Store();

