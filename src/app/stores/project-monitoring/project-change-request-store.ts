import { observable, action, computed } from "mobx-angular";
import { ProjectChangeRequest, ProjectChangeRequestItems, ProjectChangeRequestResponse } from "src/app/core/models/project-monitoring/project-change-request";

class Store {
    @observable
    private _changeRequests: ProjectChangeRequest[] = [];

    @observable
    items : ProjectChangeRequestItems[]= []

    @observable  
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'project_change_request.id';

    @observable
    individualLoaded: boolean = false;


    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    _individualChangeRequestItem = null

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    searchText: string;

    @observable
    _externalUsers = []

    @observable
    _budgets = []

    @observable
    selectedId = null;

    @observable
    selectedTabs = []

    @observable
    changeRequestItemsLoaded = false


    @action
    setProjectChangeRequests(response: ProjectChangeRequestResponse) {
        this._changeRequests = response.data;
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
    setChangeRequestItems(data){
        this.items = data.data ;
        this.changeRequestItemsLoaded = true

    }

    @action
    setIndividualItem(data){
      this._individualChangeRequestItem = data;
      this.individualLoaded = true
    }

    @action
    setExternalUsers(data){
        this._externalUsers.push(data)
    }
    @action
    setBudgets(data){
        this._budgets.push(data)
    }

    @computed
    get budgets(){
        return this._budgets
      }

    @computed
    get externalUsers(){
      return this._externalUsers
    }

    @computed
    get individualChangeRequestItem(){
        return this._individualChangeRequestItem
    }
    @computed
    get changeRequestItmes(){
        return this.items
    }

    @computed
    get allItems(): ProjectChangeRequest[] {
        return this._changeRequests.slice();
    }


}
export const ProjectChangeRequestStore = new Store();
