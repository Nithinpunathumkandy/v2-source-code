import { observable, action, computed } from "mobx-angular";
import { IndividualProjectIssue, ProjectIssue, ProjectIssuePaginationResponse } from "src/app/core/models/project-management/project-details/project-issue/project-issue";


class Store {
    @observable
    private _projectIssue: ProjectIssue[] = [];

    @observable
    private _individualProjectIssue: IndividualProjectIssue;

    @observable  
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'project_issues.id';

    @observable
    individualLoaded: boolean = false;
  
    @observable
    hideSubMenu: boolean = false;

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
    IssueId: number = null;

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
    setProjectIssue(response: ProjectIssuePaginationResponse) {
        this._projectIssue = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }


    @action
    setIndividualProjectIssue(indivitual: IndividualProjectIssue) {       
    this._individualProjectIssue = indivitual;
    this.individualLoaded = true;
    
    }

    @computed
    get allItems(): ProjectIssue[] {
        return this._projectIssue.slice();
    }

    @computed
    get indivitualProjectIssue(){
        return this._individualProjectIssue
    }

    @action
    unsetIndivitualProjectIssue() {       
        this._individualProjectIssue = null;
        this.individualLoaded = false;   
    }
  
}


export const ProjectIssueStore = new Store();

